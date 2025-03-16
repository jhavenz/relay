import { defineRelay } from '../defineRelay';

interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    user: Record<string, any> | null;
}

export const authRelay = defineRelay<AuthState>({
    name: 'auth',
    endpoint: '/login',
    init: 'checkAuth',
    queries: {
        login: async ({payload, connection}) => {
            authRelay.state$.loading.set(true);
            try {
                const response = await connection.post('/login', {payload.email, payload.password});
                authRelay.state$.user.set(response.data.user);
                authRelay.state$.isAuthenticated.set(true);
            } catch (err) {
                authRelay.state$.error.set(err instanceof Error ? err.message : 'Login failed');
                throw err;
            } finally {
                authRelay.state$.loading.set(false);
            }
        },
        logout: async ({payload, connection}) => {
            authRelay.state$.loading.set(true);
            try {
                await connection.post('/logout');
                authRelay.state$.user.set(null);
                authRelay.state$.isAuthenticated.set(false);
            } catch (err) {
                authRelay.state$.error.set(err instanceof Error ? err.message : 'Logout failed');
                throw err;
            } finally {
                authRelay.state$.loading.set(false);
            }
        },
        checkAuth: async ({payload, connection}) => {
            try {
                const response = await connection.get('/user');
                authRelay.state$.user.set(response.data);
                authRelay.state$.isAuthenticated.set(true);
            } catch (err) {
                authRelay.state$.user.set(null);
                authRelay.state$.isAuthenticated.set(false);
            }
        }
    },
    broadcasts: {
        // Define broadcasts here
    }
});
