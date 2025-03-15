import { Button } from '@/components/ui/button' // Add via `npx shadcn-ui@latest add button`
import { createRoot } from 'react-dom/client'
import './bootstrap'
import { Reactive } from './Components/Reactive'
import './echo'
import { useReactiveStore } from './Hooks/use-reactive-store'
import { store$ } from './store'

const App = () => {
    const store = useReactiveStore()

    const updateState = () => {
        store$.message.set(`Updated at ${new Date().toLocaleTimeString()}`)
    }

    return (
        <div className="p-4">
            <Reactive $value={store.message}>{(value: string) => <div className="mb-4">{value}</div>}</Reactive>
            <Button onClick={updateState}>Update State</Button>
        </div>
    )
}

const root = createRoot(document.getElementById('app')!)
root.render(<App />)
