import { createBrowserClient, isBrowser, parse, serialize } from '@supabase/ssr'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth')

    const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
            fetch,
        },
        cookies: {
            getAll() {
                if (!isBrowser()) {
                    return data.cookies
                }
                const cookie = parse(document.cookie)
                return Object.keys(cookie).map((key) => ({
                    name: key,
                    value: cookie[key] ?? '',
                }))
            },
            setAll(cookiesToSet) {
                if (!isBrowser()) return

                cookiesToSet.forEach(({ name, value, options }) => {
                    document.cookie = serialize(name, value, options)
                })
            },
        },
    })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    return { supabase, session }
}
