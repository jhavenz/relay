import {Route} from "@/relay/routing/route";

class RelayRouter {
    private callbacks: Record<string, ((data: any) => void)[]> = {}
    private routes: Record<string, Route> = {}

    on(event: string, callback: (data: any) => void) {
        if (!this.callbacks[event]) this.callbacks[event] = []
        this.callbacks[event].push(callback)
    }

    emit(event: string, data: any) {
        this.callbacks[event]?.forEach((cb) => cb(data))
    }

    addRoute(route: Route) {
        this.routes[route.name] = route
    }

    hasRoute(nameOrPath: string) {
        return Object.values(this.routes).some(route => route.name === nameOrPath || route.path === nameOrPath)
    }

    redirect(path: string) {
        window.location.href = path
    }

    getQueryParam(key: string): string | null {
        return this.queryParams.get(key)
    }

    setQueryParam(key: string, value: string) {
        this.queryParams.set(key, value)
        window.history.replaceState({}, '', `${window.location.pathname}?${this.queryParams.toString()}`)
    }

    getResponseHeaders(response: any): Record<string, string> | undefined {
        return response?.headers
    }

    get queryParams() {
        return new URLSearchParams(window.location.search)
    }
}

export default new RelayRouter()
