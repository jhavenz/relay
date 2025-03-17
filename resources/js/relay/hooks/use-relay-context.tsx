import RelayManager from '@/relay/manager'
import { ConnectorConfigImplementation } from '@/relay/types'
import { createContext, ReactNode, useContext, useEffect } from 'react'

export interface RelayProviderProps {
    connectorConfigs: (() => ConnectorConfigImplementation)[] | (() => ConnectorConfigImplementation)
    children: ReactNode
}

const RelayContext = createContext(RelayManager)

export const RelayProvider = ({ connectorConfigs, children }: RelayProviderProps) => {
    if (!Array.isArray(connectorConfigs)) {
        connectorConfigs = [connectorConfigs]
    }

    useEffect(() => {
        RelayManager.addConnectors(...connectorConfigs)
    }, [connectorConfigs])

    return <RelayContext.Provider value={RelayManager}>{children}</RelayContext.Provider>
}

export const useRelayContext = () => {
    const context = useContext(RelayContext)
    if (!context) throw new Error('RelayContext not found')
    return context
}
