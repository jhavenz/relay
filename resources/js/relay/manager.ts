import { RelayProviderProps } from '@/relay/hooks/use-relay-context'
import QueryBuilder from '@/relay/query-builder'
import { Observable } from '@legendapp/state'
import axios from 'axios'
import Echo from 'laravel-echo'
import { Broadcaster } from 'laravel-echo/src/echo'
import {
    Connection,
    ConnectorClient,
    ConnectorConfig,
    ConnectorConfigImplementation,
    ConnectorName,
    FetchClient,
    RelayConfig,
    RelayState,
} from './types'

class RelayManager<
    S extends RelayState,
    Q extends Record<string, Function> | undefined,
    B extends Record<string, Function> | undefined,
    T extends object = ConnectorConfig[ConnectorName],
> {
    private relays: Record<string, RelayConfig<S, Q, B>> = {}
    private initialized: Record<string, boolean> = {}
    private connectorConfigs: Record<string, T> = {}

    async initConnector(connectorName: ConnectorName) {
        if (!this.initialized[connectorName]) {
            const config = this.connectorConfigs[connectorName] as ConnectorConfig[ConnectorName]
            if (!config) {
                throw new Error(`No configuration found for connector: ${connectorName}`)
            }

            this.initialized[connectorName] = true

            const client = config.client as ConnectorClient | undefined
            const initFunc = config.init as ((client: ConnectorClient) => Promise<any>) | undefined

            if (initFunc && client) {
                await initFunc(client)
            }
        }
    }

    addConnectors(...connectorConfigs: RelayProviderProps['connectorConfigs'][]) {
        for (const c of connectorConfigs) {
            if (Array.isArray(c)) {
                this.addConnectors(...c)
                continue
            }

            const _config = c()
            const name = _config.name

            switch (name) {
                case 'sanctum':
                    this.connectorConfigs[name] = this.withSanctumDefaults(_config as ConnectorConfig['sanctum']) as T
                    break
                case 'axios':
                    this.connectorConfigs[name] = this.withAxiosDefaults(_config as ConnectorConfig['axios']) as T
                    break
                case 'fetch':
                    this.connectorConfigs[name] = this.withFetchDefaults(_config as ConnectorConfig['fetch']) as T
                    break
                case 'broadcast':
                    this.connectorConfigs[name] = this.withBroadcastDefaults(
                        _config as ConnectorConfig['broadcast']
                    ) as T
                    break
                default:
                    throw new Error(`Unknown connector: ${name}`)
            }
        }
    }

    getClient<K extends ConnectorName>(name: K) {
        const config = this.connectorConfigs[name] as unknown as ConnectorConfig[K] | undefined

        if (!config) {
            throw new Error(`No connector found for: ${name}`)
        }

        const client = config.client

        if (!client) {
            throw new Error(`No client found for connector: ${name}`)
        }

        return client
    }

    getConnector<K extends ConnectorName>(...names: string[]): T extends ConnectorConfig[K] ? T : never {
        for (const name of names) {
            const config = this.connectorConfigs[name]
            if (config) {
                return config as T extends ConnectorConfig[K] ? T : never
            }
        }

        throw new Error(`No connectors found for: ${names.join(', ')}`)
    }

    registerRelay(config: RelayConfig<S, Q, B>) {
        this.relays[config.name] = config
    }

    connection<K extends keyof typeof this.relays, P = keyof (typeof this.relays)[K]['state'], F = any>(
        name: K
    ): Connection<S, Q, B> {
        const key = name as ConnectorName

        if (!(name in this.relays)) {
            throw new Error(`No relay named '${name}' has been defined`)
        }

        const self = this

        return {
            get$: (prop: P, fallback: F): P extends keyof S ? S[P] : F => {
                let state$ = this.relays[name].state as RelayState | undefined
                let getFallback = () => (typeof fallback === 'function' ? fallback(state$) : fallback)

                if (!state$) {
                    return getFallback()
                }

                let stateVal = state$[prop] ?? 'missing'

                if (stateVal === 'missing') {
                    return getFallback()
                }

                return stateVal as Observable
            },
            query: () =>
                new QueryBuilder(
                    this.relays[name],
                    this.getConnector(key as ConnectorName),
                    async () => await this.initConnector.call(self, key)
                ),
            queries: () => self.relays[name].queries || {},
            broadcasts: () => self.relays[name].broadcasts || {},
        }
    }

    private withSanctumDefaults(c: ConnectorConfig['sanctum']): ConnectorConfig['sanctum'] {
        const defaults = {
            baseUrl: import.meta.env.VITE_APP_URL,
            csrfEndpoint: '/sanctum/csrf-cookie',
            signInEndpoint: '/login',
            signOutEndpoint: '/logout',
            userObjectEndpoint: '/api/user',
            twoFactorChallengeEndpoint: '/two-factor-challenge',
            usernameKey: 'email',
        }

        // noinspection DuplicatedCode
        let output = this.assignDefaults(defaults, c) as ConnectorConfig['sanctum']

        if (!output.client) {
            output.client = axios.create({
                baseURL: output.baseUrl,
                withCredentials: true,
            })
        }

        return output
    }

    private withAxiosDefaults(c: ConnectorConfig['axios']): ConnectorConfig['axios'] {
        // noinspection DuplicatedCode
        let output = this.assignDefaults(
            {
                baseUrl: import.meta.env.VITE_APP_URL,
                usernameKey: 'email',
                signInEndpoint: '/login',
                signOutEndpoint: '/logout',
                userObjectEndpoint: '/api/user',
                twoFactorChallengeEndpoint: '/two-factor-challenge',
            },
            c
        ) as ConnectorConfig['axios']

        if (!output.client) {
            output.client = axios.create({
                baseURL: output.baseUrl,
                withCredentials: true,
            })
        }

        return output
    }

    private withFetchDefaults(c: ConnectorConfig['fetch']): ConnectorConfig['fetch'] {
        let output = this.assignDefaults(
            {
                baseUrl: import.meta.env.VITE_APP_URL,
                usernameKey: 'email',
                signInEndpoint: '/login',
                signOutEndpoint: '/logout',
                userObjectEndpoint: '/api/user',
                twoFactorChallengeEndpoint: '/two-factor-challenge',
            },
            c
        ) as ConnectorConfig['fetch']

        if (!output.client) {
            output = this.createFetchClient(c)
        }

        return output
    }

    private assignDefaults(
        defaults: Partial<ConnectorConfigImplementation>,
        c: Partial<ConnectorConfigImplementation>
    ) {
        for (const _key in defaults) {
            let val = defaults[_key as keyof typeof defaults]
            if (!c[_key as keyof typeof defaults]) {
                continue
            }

            // @ts-ignore
            c[_key] = val
        }

        return c
    }

    private withBroadcastDefaults(c: ConnectorConfig['broadcast']): ConnectorConfig['broadcast'] {
        const defaults = {
            baseURL: import.meta.env.VITE_APP_URL,
            broadcaster: import.meta.env.VITE_REVERB_APP_KEY ? 'reverb' : 'pusher',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: import.meta.env.VITE_REVERB_PORT,
            wssPort: import.meta.env.VITE_REVERB_PORT,
            forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
        }

        for (const _key in defaults) {
            let key = _key as keyof typeof defaults
            if (!c[key]) {
                c[key] = defaults[key]
            }
        }

        if (!c.pusher) {
            c.pusher =
                window.Echo ||
                (new Echo({
                    broadcaster: c.broadcaster,
                    key: c.key,
                    wsHost: c.wsHost,
                    wsPort: c.wsPort,
                    wssPort: c.wssPort,
                    forceTLS: c.forceTLS,
                    enabledTransports: c.enabledTransports,
                }) as Echo<keyof Broadcaster>)
        }

        return c
    }

    private createFetchClient(config: Omit<ConnectorConfig['fetch'], 'client'>): ConnectorConfig['fetch'] {
        let baseUrl = config.baseUrl || ''
        let defaultHeaders = config.defaultHeaders || {}

        const makeUrl = (uri: string) => {
            if (uri.startsWith('http')) {
                return uri
            } else if (!baseUrl) {
                throw new Error('Base URL has not been set')
            }

            return `${baseUrl}/${uri.replace(/^\//, '')}`
        }

        const mergeOpts = (opts?: RequestInit) => {
            const headers = {
                ...defaultHeaders,
                ...(opts?.headers || {}),
            }

            return {
                ...opts,
                ...headers,
            }
        }

        const fetchClient: FetchClient = {
            get baseUrl() {
                return baseUrl
            },
            get defaultHeaders() {
                return defaultHeaders
            },
            set baseUrl(url: string) {
                baseUrl = url
            },
            set defaultHeaders(headers: Record<string, string>) {
                defaultHeaders = headers
            },
            get: async (uri: string, options?: RequestInit): Promise<Response> => {
                return fetch(makeUrl(uri), {
                    ...mergeOpts(options),
                    method: 'GET',
                })
            },
            post: async (uri: string, data?: any, options?: RequestInit): Promise<Response> => {
                return fetch(makeUrl(uri), {
                    ...options,
                    method: 'POST',
                    body: typeof data === 'object' ? JSON.stringify(data) : data,
                })
            },
            put: async (uri: string, data?: any, options?: RequestInit): Promise<Response> => {
                return fetch(makeUrl(uri), {
                    ...options,
                    method: 'PUT',
                    body: typeof data === 'object' ? JSON.stringify(data) : data,
                })
            },
            delete: async (uri: string, options?: RequestInit): Promise<Response> => {
                return fetch(makeUrl(uri), {
                    ...options,
                    method: 'DELETE',
                })
            },
            patch: async (uri: string, data?: any, options?: RequestInit): Promise<Response> => {
                return fetch(makeUrl(uri), {
                    ...options,
                    method: 'PATCH',
                    body: typeof data === 'object' ? JSON.stringify(data) : data,
                })
            },
            head: async (uri: string, options?: RequestInit): Promise<Response> => {
                return fetch(makeUrl(uri), {
                    ...options,
                    method: 'HEAD',
                })
            },
            options: (uri: string, options?: RequestInit): Promise<Response> => {
                return fetch(makeUrl(uri), {
                    ...options,
                    method: 'OPTIONS',
                })
            },
        }

        return {
            ...config,
            client: fetchClient,
        } as ConnectorConfig['fetch']
    }
}

export default new RelayManager()
