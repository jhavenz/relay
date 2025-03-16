import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRelayAuth } from '@/relay/hooks/use-relay-auth'
import { useState } from 'react'

const LoginComponent = () => {
    const { login, error } = useRelayAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        try {
            await login({ email, password })
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin}>Login</Button>
            {error && <div className="text-red-500">{error}</div>}
        </div>
    )
}

export default LoginComponent
