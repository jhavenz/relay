import { relays$ } from '@/relays'
import defineRelay from '@/relays/define-relay'
import { useSelector } from '@legendapp/state/react'

export function useRelay<T>(
    relayName: string,
    queryFn?: (query: ReturnType<typeof defineRelay<T>>['query']) => ReturnType<typeof defineRelay<T>>['query']
) {
    const relay = relays$.get()[relayName]
    if (!relay) throw new Error(`relay '${relayName}' not defined`)

    const { state } = relay

    if (queryFn) {
        const queryBuilder = queryFn(relay.config.model?.query())
        // For simplicity, fetch data on first render; later, we can serialize and cache
        // Placeholder for now
        return useSelector(() => state.data.get()) // Eventually, filter based on query params or fetch
    }

    return {
        data: useSelector(() => state.data.get()),
        loading: useSelector(() => state.loading.get()),
        error: useSelector(() => state.error.get()),
        query: relay.config.model?.query,
    }
}
