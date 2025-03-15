import { reactive } from '@legendapp/state/react'
import { ReactNode } from 'react'

interface ReactiveProps<T> {
    $value: any
    children: (value: T) => ReactNode
}

export const Reactive = reactive(function Reactive<T>({ $value, children }: ReactiveProps<T>) {
    return children($value.get())
})
