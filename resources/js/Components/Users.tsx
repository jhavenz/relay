import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'

const Users = () => {
    const { isAuthenticated } = useAuth()
    const { data: users, loading, error } = useRelay('users')

    if (!isAuthenticated) return <div>Please log in to view users.</div>
    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="grid grid-cols-1 gap-4">
            {users.map((user) => (
                <Card key={user.id}>
                    <CardHeader>
                        <CardTitle>{user.name}</CardTitle>
                    </CardHeader>
                    <CardContent>{user.email}</CardContent>
                </Card>
            ))}
        </div>
    )
}

export default Users
