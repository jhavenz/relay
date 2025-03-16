import App from '@/app'
import { SanctumConfig } from '@/relay/connectors/types'
import { RelayProvider } from '@/relay/hooks/use-relay-context'
import { AxiosInstance } from 'axios'
import { createRoot } from 'react-dom/client'
import './bootstrap'
import './echo'

const sanctumConfig: () => SanctumConfig = () => ({
    name: 'sanctum',
    baseUrl: import.meta.env['APP_URL'],
    init: async (axios: AxiosInstance) => {
        await axios.get('/sanctum/csrf-cookie')
    },
})

const root = createRoot(document.getElementById('app')!)

root.render(
    <RelayProvider connectorConfigs={[sanctumConfig]}>
        <App />
    </RelayProvider>
)
