import router from '@/relay/routing/router'

export default function guest(next: (context: any) => any, context: any): any {
    if (context.state.isAuthenticated) {
        return router.redirect()
    }

    return next(context)
}
