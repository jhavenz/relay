import { observable } from '@legendapp/state'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { syncObservable } from '@legendapp/state/sync'
import axios from 'axios'

let initialState = {
    message: 'Hello from synced state!',
}

export function setupStore(initialState = {}, options = {}) {
    const store$ = observable(initialState)

    syncObservable(store$, {
        get: async () => {
            const response = await axios.get('/api/state')
            return response.data
        },
        set: async ({ value$ }) => {
            console.log('Saving state:', value$.get())

            await axios.post('/api/state', { state: value$.get() })
        },
        transform: {},
        ...options,
        persist: {
            name: 'store',
            plugin: ObservablePersistLocalStorage,
        },
    })

    return store$
}

export const store$ = setupStore(initialState)
