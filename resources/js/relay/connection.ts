import { Connector, ConnectorName } from '@/relay/connectors/types'
import { RelayConfig } from '@/relay/hooks/define-relay'
import RelayManager from '@/relay/manager'
import QueryBuilder from '@/relay/query'
import { observable } from '@legendapp/state'

export class RelayConnection<T> {
    constructor(private config: RelayConfig<T>) {}

    // provide a query function for building up queries which also receives this connection
    queryBuilder() {
        let connectors = ['sanctum', 'api'] as ConnectorName[]

        return new QueryBuilder(this.config, this.selectConnector(connectors))
    }

    // allow the user to call the 'queries' or 'broadcasts' functions they define when calling 'defineRelay'

    private selectConnector(connectors: ConnectorName[]): Connector {
        // Implement default order: broadcast > sanctum > api
        const order = [...(connectors || []), 'broadcast', 'sanctum', 'api']

        return RelayManager.getConnector(...order)
    }

    private newState() {
        return observable({
            data: this.config.state as T,
            loading: false,
            errors: {},
        })
    }
}
