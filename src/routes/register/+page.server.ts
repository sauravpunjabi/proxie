import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
    register: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (!email || !password || !confirmPassword) {
            return fail(400, { error: 'Please fill in all fields' })
        }

        if (password !== confirmPassword) {
            return fail(400, { error: 'Passwords do not match' })
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            return fail(400, { error: error.message })
        }

        // Redirect to login or a confirmation page
        throw redirect(303, '/')
    },
}
