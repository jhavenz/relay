import { ConnectorConfig } from '@/relay/connectors/types'
import RelayManager from '@/relay/manager'
import { createContext, ReactNode, useContext, useEffect } from 'react'

interface RelayProviderProps {
    connectorConfigs: (() => ConnectorConfig)[] | (() => ConnectorConfig)
    children: ReactNode
}

const RelayContext = createContext(RelayManager)

export const RelayProvider = ({ connectorConfigs, children }: RelayProviderProps) => {
    if (!Array.isArray(connectorConfigs)) {
        connectorConfigs = [connectorConfigs]
    }

    useEffect(() => {
        RelayManager.addConnectors(...connectorConfigs)
    }, [...connectorConfigs])

    return <RelayContext.Provider value={RelayManager}>{children}</RelayContext.Provider>
}

export const useRelayContext = () => {
    const context = useContext(RelayContext)
    if (!context) throw new Error('RelayContext not found')
    return context
}
