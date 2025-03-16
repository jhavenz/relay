import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { defineRelay } from '@/relay/hooks/define-relay'
import { useRelay } from '@/relay/hooks/use-relay'

const postsRelay = defineRelay({
    name: 'posts',
    endpoint: '/posts',
    primaryKey: 'id',
})

const Posts = () => {
    const { data: posts, loading, error } = useRelay('posts')

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
                <Card key={post.id}>
                    <CardHeader>
                        <CardTitle>{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>{post.content}</CardContent>
                </Card>
            ))}
        </div>
    )
}

export default Posts
