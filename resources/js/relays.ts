import { observable } from '@legendapp/state'

export const relays$ = observable<Record<string, { config: any; state: any }>>({})
