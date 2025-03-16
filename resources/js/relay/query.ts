import { Connector } from '@/relay/connectors/types'
import { RelayConfig } from '@/relay/hooks/define-relay'

export default class QueryBuilder<T> {
    constructor(
        private config: RelayConfig<T>,
        private connector: Connector
    ) {}
}
