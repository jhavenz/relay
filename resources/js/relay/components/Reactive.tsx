import { useSelector } from '@legendapp/state/react'
import { ReactNode } from 'react'

interface ReactiveProps<T> {
    $value: any // Ideally, type this as an observable, e.g., Observable<T>
    children: (value: T) => ReactNode
}

export function Reactive<T>({ $value, children }: ReactiveProps<T>) {
    let childFunc = children
    const value = useSelector(() => $value.get())
    if (typeof childFunc !== 'function') {
        childFunc = () => children
    }

    return <>{childFunc(value)}</>
}
