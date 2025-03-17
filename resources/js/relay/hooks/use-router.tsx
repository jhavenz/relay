import { Routes } from '@/relay/routing/route'
import router from '@/relay/routing/router'
import { createContext, ReactNode, useContext } from 'react'

const RouterContext = createContext(router)

type ProviderArgs = {
    routes: Routes
    children: ReactNode
}

export const RouterProvider = ({ routes, children }: ProviderArgs) => {
    for (const route of routes) {
        router.addRoute(route)
    }

    return <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
}

export default function useRouter() {
    const router = useContext(RouterContext)

    if (!router) {
        throw new Error('useRouter must be used within a RouterProvider')
    }

    return router
}
