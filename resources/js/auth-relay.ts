import { defineRelay } from '@/relay/hooks/define-relay';

interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    errors: Record<string, string[]>
    user: Record<string, any> | null;
}

interface AuthQueries {
    login: (args: { payload: { email: string, password: string } }) => Promise<void>;
    logout: (args: { payload?: any }) => Promise<void>;
    checkAuth: (args: { payload?: any }) => Promise<void>;
}

interface AuthBroadcasts {
    // Define your broadcasts here
}

export const authRelay = defineRelay<AuthState, AuthQueries, AuthBroadcasts>({
    name: 'auth',
    endpoint: '/login',
    init: () => {
        authRelay.queries()
    },
    state: {
        isAuthenticated: false,
        loading: false,
        error: null,
        user: null
    },
    middleware: {
        'guest': [
            'login'
        ],
        'auth': [
            'checkAuth',
            'logout'
        ]
    },
    queries: {
        login: async ({payload, connection}) => {
            authRelay.getst.loading.set(true);
            try {
                const response = await connection.post('/login', {payload.email, payload.password});
                authRelay.get$('user', {}).set(response.data.user)
                authRelay.get$('isAuthenticated', false).set(true);
            } catch (err) {
                authRelay.get$('errors').set(err instanceof Error ? err.message : 'Login failed');
                throw err;
            } finally {
                authRelay.state.loading.set(false);
            }
        },
        logout: async ({payload, connection}) => {
            authRelay.state.loading.set(true);
            try {
                await connection.post('/logout');
                authRelay.state.user.set(null);
                authRelay.state.isAuthenticated.set(false);
            } catch (err) {
                authRelay.state.error.set(err instanceof Error ? err.message : 'Logout failed');
                throw err;
            } finally {
                authRelay.state.loading.set(false);
            }
        },
        checkAuth: async ({payload, connection}) => {
            try {
                const response = await connection.get('/user');
                authRelay.state.user.set(response.data);
                authRelay.state.isAuthenticated.set(true);
            } catch (err) {
                authRelay.state.user.set(null);
                authRelay.state.isAuthenticated.set(false);
            }
        }
    },
    broadcasts: {
        // Define broadcasts here
    }
});
