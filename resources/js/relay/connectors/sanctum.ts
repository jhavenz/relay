import axios, { AxiosInstance } from 'axios'
import { Connector, ConnectorName } from './types'

export type ConnectorConfig = {
    name: string
    baseUrl: string
}

export type SanctumConfig = ConnectorConfig & {
    name: string
    init: (axios: AxiosInstance) => void
    signInEndpoint?: string
    signOutEndpoint?: string
    userObjectEndpoint?: string
    twoFactorChallengeEndpoint?: string
    axios?: AxiosInstance
    usernameKey?: string
    csrfEndpoint?: string
}

export class SanctumConnector implements Connector {
    constructor(private config: SanctumConfig) {
        this.init()
    }

    name() {
        return 'sanctum' as ConnectorName
    }

    async connect() {
        await axios.get(`${this.config.baseUrl}${this.config.csrfEndpoint}`, { withCredentials: true })
    }

    disconnect() {
        return axios.post(`${this.config.baseUrl}${this.config.signOutEndpoint}`, {}, { withCredentials: true })
    }

    private init() {
        const defaults = {
            csrfEndpoint: '/sanctum/csrf-cookie',
            signInEndpoint: '/login',
            signOutEndpoint: '/logout',
            userObjectEndpoint: '/api/user',
            twoFactorChallengeEndpoint: '/two-factor-challenge',
            usernameKey: 'email',
        }

        for (const _key in defaults) {
            let key = _key as keyof typeof defaults
            if (!this.config[key]) {
                this.config[key] = defaults[key]
            }
        }

        if (!this.config.axios) {
            this.config.axios = axios.create({
                baseURL: this.config.baseUrl,
                withCredentials: true,
            })
        }
    }
}
