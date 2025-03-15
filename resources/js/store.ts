import { observable } from '@legendapp/state'
import { syncObservable } from '@legendapp/state/sync'
import axios from 'axios'

export function setupStore(initialState = {}, options = {}) {
    const store$ = observable(initialState)

    const defaultOptions = {
        get: async () => {
            const response = await axios.get('/api/state')
            return response.data
        },
        set: async ({ value }: { value: any }) => {
            await axios.post('/api/state', { state: value })
        },
        transform: {},
    }

    syncObservable(store$, {
        ...defaultOptions,
        ...options,
        persist: {
            name: 'store',
        },
    })

    return store$
}

export const store$ = setupStore({
    message: 'Hello from synced state!',
})
