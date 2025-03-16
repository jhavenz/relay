import { ValueFromArray } from 'rxjs'

type RelayResources = string[]

interface SerializableQuery {
    serialize(): string
}

export interface Connector<T> {
    connect(): void
    disconnect(): void
    fetch(query: SerializableQuery): Promise<T>
    createOne(resource: ValueFromArray<RelayResources>, data: Partial<T>): Promise<T>
    updateOne(resource: ValueFromArray<RelayResources>, id: string | number, data: Partial<T>): Promise<T>
    deleteOne(resource: ValueFromArray<RelayResources>, id: string | number): Promise<void>
    createMany(resource: ValueFromArray<RelayResources>, data: Partial<T>[]): Promise<T[]>
    updateMany(resource: ValueFromArray<RelayResources>, data: Partial<T>[]): Promise<T[]>
    deleteMany(resource: ValueFromArray<RelayResources>, ids: (string | number)[]): Promise<void>
}
