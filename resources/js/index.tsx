import App from '@/app'
import { SanctumConnector } from '@/relay/connectors/sanctum'
import { RelayProvider } from '@/relay/hooks/use-relay-context'
import { AxiosInstance } from 'axios'
import { createRoot } from 'react-dom/client'
import './bootstrap'
import './echo'

const sanctumConnector: () => SanctumConnector = () => ({
    name: 'sanctum',
    baseUrl: import.meta.env['APP_URL'],
    init: async (axios: AxiosInstance) => {
        await axios.get('/sanctum/csrf-cookie')
    },
})

const root = createRoot(document.getElementById('app')!)

root.render(
    <RelayProvider connectorConfigs={[sanctumConnector]}>
        <App />
    </RelayProvider>
)
