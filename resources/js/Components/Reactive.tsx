import { reactive } from '@legendapp/state/react'
import { ReactNode } from 'react'

interface ReactiveProps<T> {
    $value: any
    children: (value: T) => ReactNode
}

export function Reactive<T>(props: ReactiveProps<T>) {
    const $ReactiveComponent = reactive(props.$value)

    return <$ReactiveComponent>{props.children}</$ReactiveComponent>
}
