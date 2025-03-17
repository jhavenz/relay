import QueryBuilder from '@/relay/query-builder'
import { Observable } from '@legendapp/state'
import { AxiosInstance } from 'axios'
import Echo, { EchoOptions } from 'laravel-echo'
import { Broadcaster } from 'laravel-echo/src/echo'

export interface SerializableQuery {
    serialize(): string
}

export type ConnectorName = keyof ConnectorConfig

export type ConnectorClient = {
    [K in ConnectorName]: ConnectorConfig[K] extends { client?: infer C } ? C : never
}

export type QueryArgs = {
    payload: Record<any, any>
    axios?: AxiosInstance
}
export type BroadcastArgs = {
    payload: Record<any, any>
    // an open connection using 'echo.js'
    socket?: any
}

export type RelayState = undefined | Observable | Record<any, any>

export type RelayConfig<T extends RelayState, Q = Record<string, Function>, B = Record<string, Function>> = {
    name: string
    endpoint?: string
    primaryKey?: string
    state?: T
    init: (client: ConnectorClient) => void
    queries?: Q
    broadcasts?: B
}

export type Connection<
    P extends keyof T,
    T extends RelayState,
    F = any,
    Q = Record<string, Function> | undefined,
    B = Record<string, Function> | undefined,
> = {
    get$: (prop: P, fallback?: F) => P extends keyof T ? T[P] : F
    query: () => QueryBuilder<T>
    queries: () => Q
    broadcasts: () => B
}

export type ConnectorConfigImplementation = ConnectorConfig[keyof ConnectorConfig]

export type FetchClient = {
    baseUrl: string
    defaultHeaders: Record<string, string>
    get: (url: string, options?: RequestInit) => Promise<Response>
    post: (url: string, data?: any, options?: RequestInit) => Promise<Response>
    put: (url: string, data?: any, options?: RequestInit) => Promise<Response>
    delete: (url: string, options?: RequestInit) => Promise<Response>
    patch: (url: string, data?: any, options?: RequestInit) => Promise<Response>
    head: (url: string, options?: RequestInit) => Promise<Response>
    options: (url: string, options?: RequestInit) => Promise<Response>
}

export type ConnectorConfig = {
    sanctum: {
        name: 'sanctum'
        baseUrl: string
        signInEndpoint?: string
        init?: (axios: AxiosInstance) => void
        signOutEndpoint?: string
        userObjectEndpoint?: string
        twoFactorChallengeEndpoint?: string
        client?: AxiosInstance
        usernameKey?: string
        csrfEndpoint?: string
        defaultHeaders?: Record<string, string>
    }
    axios: {
        name: 'axios'
        baseUrl: string
        client?: AxiosInstance
        init?: (axios: AxiosInstance) => void
        signInEndpoint?: string
        signOutEndpoint?: string
        userObjectEndpoint?: string
        twoFactorChallengeEndpoint?: string
        usernameKey?: string
        defaultHeaders?: Record<string, string>
    }
    fetch: {
        name: 'fetch'
        baseUrl: string
        client?: FetchClient
        init?: (client: FetchClient) => void
        signInEndpoint?: string
        signOutEndpoint?: string
        userObjectEndpoint?: string
        twoFactorChallengeEndpoint?: string
        usernameKey?: string
        defaultHeaders?: Record<string, string>
    }
    broadcast: EchoOptions<keyof Broadcaster> & {
        name: 'broadcast'
        baseUrl: string
        defaultHeaders?: Record<string, string>
        client?: Echo<keyof Broadcaster>
        init?: (echo: Echo<keyof Broadcaster>) => void
    }
}
