import { Button } from '@/components/ui/button'
import { Reactive } from '@/relay/components/Reactive'
import { store$ } from '@/store'
import { useObservable } from '@legendapp/state/react'

const App = () => {
    const store = useObservable(store$)

    const updateState = () => {
        store$.message.set(`Updated at ${new Date().toLocaleTimeString()}`)
    }

    return (
        <div className="p-4">
            <Reactive $value={store$.message}>{(value: any) => <div>{value}</div>}</Reactive>
            <Button onClick={updateState}>Update State</Button>
        </div>
    )
}

export default App
