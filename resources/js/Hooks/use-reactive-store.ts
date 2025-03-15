import { store$ } from '@/store'
import { useObservable } from '@legendapp/state/react'

export function useReactiveStore() {
    return useObservable(store$)
}
