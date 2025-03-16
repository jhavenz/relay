import { authRelay } from '@/auth-relay'
import Echo from 'laravel-echo'

// Declare global Echo on window
declare global {
    interface Window {
        Echo: Echo<'reverb'>
    }
}

function setupBroadcastListeners() {
    const channel = window.Echo.channel('auth')
    Object.entries(authRelay.broadcasts).forEach(([event, handler]) => {
        channel.listen(`.${event}`, (e) => handler(e))
    })
}

setupBroadcastListeners()

// Call this after defining resources
setupWebSocketListeners()
