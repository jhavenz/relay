import { store$ } from '@/store'
import { Observable } from '@legendapp/state'
import { useObservable } from '@legendapp/state/react'

export function useReactiveStore(): Observable<typeof store$> {
    return useObservable(store$)
}
