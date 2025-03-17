import RelayManager from '@/relay/manager'
import { Connection, RelayConfig, RelayState } from '@/relay/types'

export function defineRelay<
    T extends RelayState,
    Q extends Record<string, Function> | undefined,
    B extends Record<string, Function> | undefined,
>(config: RelayConfig<T, Q, B>): Connection<T> {
    RelayManager.registerRelay(config)

    return RelayManager.connection(config.name)
}
