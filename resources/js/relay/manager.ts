import { RelayConnection } from '@/relay/connection'
import { RelayConfig } from '@/relay/hooks/define-relay'
import axios from 'axios'
import Echo from 'laravel-echo'
import { Broadcaster } from 'laravel-echo/src/echo'
import { ApiConfig, BroadcastConfig, ConnectorConfig, ConnectorName, SanctumConfig } from './connectors/types'

class RelayManager<C, T> {
    private connected: Record<string, boolean> = {}
    private connectorConfigs: Record<string, ConnectorConfig> = {}
    private connections: Record<string, RelayConnection<C>> = {}
    private relays: Record<string, RelayConfig<T>> = {}

    async initConnector(connectorName: ConnectorName) {
        if (!this.connected[connectorName]) {
            switch (connectorName) {
                case 'sanctum':
                    const sanctumConfig = this.connectorConfigs[connectorName] as SanctumConfig
                    sanctumConfig.init(sanctumConfig.axios)
                    break
                case 'api':
                    const apiConfig = this.connectorConfigs[connectorName] as ApiConfig
                    apiConfig.init(apiConfig.axios)
                    break
                case 'broadcast':
                    const broadcastConfig = this.connectorConfigs[connectorName] as BroadcastConfig<keyof Broadcaster>
                    broadcastConfig.init(broadcastConfig.pusher)
                    break
                default:
                    throw new Error(`Unknown connector name: ${connectorName}`)
            }
            this.connected[connectorName] = true
        }
    }

    addConnectors(...connectorConfigs: (() => ConnectorConfig)[]) {
        for (const c of connectorConfigs) {
            const _config = c()
            const name = _config.name

            switch (name) {
                case 'sanctum':
                    this.connectorConfigs[name] = this.withSanctumDefaults(_config)
                    break
                case 'api':
                    this.connectorConfigs[name] = this.withApiDefaults(_config)
                    break
                case 'broadcast':
                    this.connectorConfigs[name] = this.withBroadcastDefaults(_config)
                    break
                default:
                    throw new Error(`Unknown connector: ${name}`)
            }
        }
    }

    getConnector(...names: string[]): ConnectorConfig {
        for (const name of names) {
            if (this.connectorConfigs[name]) {
                return this.connectorConfigs[name]
            }
        }

        throw new Error(`No connectors found for: ${names.join(', ')}`)
    }

    registerRelay(config: RelayConfig<T>) {
        this.relays[config.name] = config
    }

    connection<C>(name: keyof typeof this.relays): RelayConnection<C> {
        if (!this.connections[name]) {
            const config = this.relays[name]
            this.connections[name] = new RelayConnection(config)
        }

        return this.connections[name]
    }

    private withSanctumDefaults(c: SanctumConfig) {
        const defaults = {
            baseUrl: import.meta.env.VITE_APP_URL,
            csrfEndpoint: '/sanctum/csrf-cookie',
            signInEndpoint: '/login',
            signOutEndpoint: '/logout',
            userObjectEndpoint: '/api/user',
            twoFactorChallengeEndpoint: '/two-factor-challenge',
            usernameKey: 'email',
        }

        for (const _key in defaults) {
            let key = _key as keyof typeof defaults
            if (!c[key]) {
                c[key] = defaults[key]
            }
        }

        if (!c.axios) {
            c.axios = axios.create({
                baseURL: c.baseUrl,
                withCredentials: true,
            })
        }

        return c
    }

    private withApiDefaults(c: ApiConfig) {
        const defaults = {
            baseUrl: import.meta.env.VITE_APP_URL,
            usernameKey: 'email',
            signInEndpoint: '/login',
            signOutEndpoint: '/logout',
            userObjectEndpoint: '/api/user',
            twoFactorChallengeEndpoint: '/two-factor-challenge',
        }

        for (const _key in defaults) {
            let key = _key as keyof typeof defaults
            if (!c[key]) {
                c[key] = defaults[key]
            }
        }

        if (!c.axios) {
            c.axios = axios.create({
                baseURL: c.baseUrl,
                withCredentials: true,
            })
        }

        return c
    }

    private withBroadcastDefaults<T extends keyof Broadcaster>(c: BroadcastConfig<T>) {
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
                }) as Echo<T>)
        }

        return c
    }
}

export default new RelayManager()
