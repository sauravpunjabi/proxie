import { createServerClient } from '@supabase/ssr'
import { type Handle } from '@sveltejs/kit'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => event.cookies.getAll(),
            setAll: (cookiesToSet) => {
                cookiesToSet.forEach(({ name, value, options }) => {
                    event.cookies.set(name, value, { ...options, path: '/' })
                })
            },
        },
    })

    event.locals.safeGetSession = async () => {
        const {
            data: { session },
        } = await event.locals.supabase.auth.getSession()

        if (!session) {
            return { session: null, user: null }
        }

        try {
            const {
                data: { user },
                error,
            } = await event.locals.supabase.auth.getUser()

            if (error) {
                console.error('safeGetSession: getUser error', error)
                // Fallback to session user if getUser fails (e.g. network error)
                if (session && session.user) {
                    console.log('safeGetSession: Falling back to session user', session.user.email)
                    return { session, user: session.user }
                }
                return { session: null, user: null }
            }

            return { session, user }
        } catch (e) {
            console.error('safeGetSession: Exception during getUser', e)
            // Fallback to session user if exception occurs
            if (session && session.user) {
                console.log('safeGetSession: Falling back to session user (exception)', session.user.email)
                return { session, user: session.user }
            }
            return { session: null, user: null }
        }
    }

    const { session, user } = await event.locals.safeGetSession()

    // Assign to locals so other server functions can access them
    event.locals.session = session
    event.locals.user = user

    if (event.url.pathname === '/login' || event.url.pathname === '/register') {
        if (user) {
            return new Response(null, {
                status: 303,
                headers: { location: '/' },
            })
        }
    } else if (event.url.pathname !== '/auth/callback' && !user) {
        // Protect all other routes
        return new Response(null, {
            status: 303,
            headers: { location: '/login' },
        })
    }

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range' || name === 'x-supabase-api-version'
        },
    })
}
