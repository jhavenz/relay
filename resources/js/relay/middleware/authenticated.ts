export default function authenticated(
    next: (context: any) => any,
    context: any
): any {
    if (!context.state.isAuthenticated) {
        return next({
            ...context,
            state: {
                ...context.state,
                error: 'You must be logged in to access this resource.'
            }
        });
    }

    return next(context);
    }
