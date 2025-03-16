export class RelayRouter {
    private callbacks: Record<string, ((data: any) => void)[]> = {}

    on(event: string, callback: (data: any) => void) {
        if (!this.callbacks[event]) this.callbacks[event] = []
        this.callbacks[event].push(callback)
    }

    emit(event: string, data: any) {
        this.callbacks[event]?.forEach((cb) => cb(data))
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
