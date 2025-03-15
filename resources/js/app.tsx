import { createRoot } from 'react-dom/client'
import '../css/app.css'
import './bootstrap'
import { Reactive } from './Components/Reactive'
import './echo'
import { useReactiveStore } from './Hooks/use-reactive-store'

const App = () => {
    const store: Record<string, any> = useReactiveStore()

    return <Reactive $value={store.message}>{(value: any) => <div>{value}</div>}</Reactive>
}

const root = createRoot(document.getElementById('app')!)
root.render(<App />)
