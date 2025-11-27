import { z } from 'zod'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    due_date: z.string().optional(), // We'll parse this if present
})

export const actions: Actions = {
    default: async ({ request, locals: { supabase, user } }) => {
        if (!user) {
            throw redirect(303, '/login')
        }

        const formData = await request.formData()
        const rawData = Object.fromEntries(formData)

        // Handle optional empty strings as undefined for optional fields if needed, 
        // but zod handles empty strings for optional? No, empty string is a string.
        // For date, empty string should be undefined or null.
        if (rawData.due_date === '') {
            delete rawData.due_date
        }

        const result = createTaskSchema.safeParse(rawData)

        if (!result.success) {
            const { fieldErrors: errors } = result.error.flatten()
            return fail(400, { errors, data: rawData })
        }

        const { title, description, priority, due_date } = result.data

        const { error } = await supabase.from('tasks').insert({
            user_id: user.id,
            title,
            description,
            priority,
            due_date: due_date ? new Date(due_date).toISOString() : null,
            status: 'todo',
        })

        if (error) {
            console.error('Error creating task:', error)
            return fail(500, { message: 'Failed to create task. Please try again.', data: rawData })
        }

        throw redirect(303, '/')
    },
}
