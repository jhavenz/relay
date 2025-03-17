export type Route = {
    name: string
    path: string
}

export type Routes = Route[]

export function createRoute(name: string, path: string): Route {
    return { name, path }
}
