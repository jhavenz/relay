import Echo from 'laravel-echo'
import { store$ } from './store'

// Declare global Echo on window
declare global {
    interface Window {
        Echo: Echo
    }
}

// Listen to the 'state' channel for StateUpdated events
window.Echo.channel('state').listen('StateUpdated', (e: { state: any }) => {
    store$.set(e.state)
})
