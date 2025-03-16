import { authRelay } from '@/auth-relay'
import { useSelector } from '@legendapp/state/react'

export function useRelayAuth() {
    return {
        user: useSelector(() => authRelay.state$.user.get()),
        isAuthenticated: useSelector(() => authRelay.state$.isAuthenticated.get()),
        loading: useSelector(() => authRelay.state$.loading.get()),
        error: useSelector(() => authRelay.state$.error.get()),
        login: authRelay.queries.login,
        logout: authRelay.queries.logout,
    }
}
