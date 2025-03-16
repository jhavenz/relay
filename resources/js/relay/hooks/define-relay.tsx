import { RelayConnection } from '@/relay/connection'
import { Connector } from '@/relay/connectors/types'
import RelayManager from '@/relay/manager'
import { AxiosInstance } from 'axios'

export type QueryArgs = {
    payload: Record<any, any>
    axios?: AxiosInstance
}

export type BroadcastArgs = {
    payload: Record<any, any>
    // an open connection using 'echo.js'
    socket?: any
}

export type RelayConfig<T = null> = {
    name: string
    endpoint?: string
    primaryKey?: string
    state?: T
    init: (connector: Connector) => void
    queries?: Record<string, (args: QueryArgs) => any>
    broadcasts?: Record<string, (args: BroadcastArgs) => any>
}

export function defineRelay<T = {}>(config: RelayConfig<T>): RelayConnection<T> {
    RelayManager.registerRelay(config)

    return RelayManager.connection(config.name)
}
