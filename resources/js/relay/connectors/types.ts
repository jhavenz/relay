import { AxiosInstance } from 'axios'
import Echo, { EchoOptions } from 'laravel-echo'
import { Broadcaster } from 'laravel-echo/src/echo'
import Pusher from 'pusher-js'

export interface SerializableQuery {
    serialize(): string
}

export type ConnectorName = 'sanctum' | 'api' | 'broadcast'

export type ConnectorConfig = {
    name: string
    baseUrl: string
    init: (args: any) => void
}

export type SanctumConfig = ConnectorConfig & {
    signInEndpoint?: string
    init: (axios: AxiosInstance) => void
    signOutEndpoint?: string
    userObjectEndpoint?: string
    twoFactorChallengeEndpoint?: string
    axios?: AxiosInstance
    usernameKey?: string
    csrfEndpoint?: string
}

export type ApiConfig = ConnectorConfig & {
    axios?: AxiosInstance
    init: (axios: AxiosInstance) => void
    signInEndpoint?: string
    signOutEndpoint?: string
    userObjectEndpoint?: string
    twoFactorChallengeEndpoint?: string
    usernameKey?: string
}

export type BroadcastConfig<T extends keyof Broadcaster> = ConnectorConfig &
    EchoOptions<T> & {
        pusher?: Echo<T>
        init: (echo: Pusher) => void
    }

// Generic Connector interface
export interface Connector {
    name(): ConnectorName
    connect(): void
    disconnect(): void
}
