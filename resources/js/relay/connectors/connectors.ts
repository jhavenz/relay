export type RelayResources = string[]

export interface SerializableQuery {
    serialize(): string
}

// Generic Connector interface
export interface Connector<T = any> {
    connect(): void
    disconnect(): void
    fetch(query: SerializableQuery): Promise<T>
    createOne(resource: string, data: Partial<T>): Promise<T>
    updateOne(resource: string, id: string | number, data: Partial<T>): Promise<T>
    deleteOne(resource: string, id: string | number): Promise<void>
    createMany(resource: string, data: Partial<T>[]): Promise<T[]>
    updateMany(resource: string, data: Partial<T>[]): Promise<T[]>
    deleteMany(resource: string, ids: (string | number)[]): Promise<void>
}
