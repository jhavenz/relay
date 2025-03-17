import { useRelayContext } from '@/relay/hooks/use-relay-context'
import { Connection, RelayState } from '@/relay/types'

export function useRelay<T extends RelayState>(relayName: string): Connection<T> {
    const relayManager = useRelayContext()
    const connection = relayManager.connection(relayName) as Connection<T>

    if (!connection) {
        throw new Error(`Relay '${relayName}' not found. Ensure it is defined with defineRelay.`)
    }

    return connection
}

// Example usage:
/*
const authRelay = defineRelay({
    name: 'auth',
    state: { user: null, authenticated: false },
    init: (connector) => { connector.connect(); },
    queries: {
        login: ({ payload }) => axios.post('/login', payload),
    },
});

const { queryBuilder, getState } = useRelay('auth');
const state = getState();
*/
