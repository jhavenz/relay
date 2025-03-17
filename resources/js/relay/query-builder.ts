import { ConnectorConfigImplementation, RelayConfig, RelayState } from '@/relay/types'

export default class QueryBuilder<T extends RelayState> {
    constructor(
        private config: RelayConfig<T>,
        private connector: ConnectorConfigImplementation,
        private initConnector: () => Promise<void>
    ) {}
}
