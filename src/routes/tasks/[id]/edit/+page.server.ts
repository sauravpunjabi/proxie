import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { z } from 'zod'

const editTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']),
    due_date: z.string().optional(),
    status: z.enum(['todo', 'in-progress', 'completed']),
})

export const load: PageServerLoad = async ({ params, locals: { supabase, user } }) => {
    if (!user) {
        throw redirect(303, '/login')
    }

    const { data: task, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

    if (error || !task) {
        console.error('Error fetching task:', error)
        throw redirect(303, '/')
    }

    return { task }
}

export const actions: Actions = {
    default: async ({ request, params, locals: { supabase, user } }) => {
        if (!user) {
            throw redirect(303, '/login')
        }

        const formData = await request.formData()
        const rawData = Object.fromEntries(formData)

        if (rawData.due_date === '') {
            delete rawData.due_date
        }

        const result = editTaskSchema.safeParse(rawData)

        if (!result.success) {
            const { fieldErrors: errors } = result.error.flatten()
            return fail(400, { errors, data: rawData })
        }

        const { title, description, priority, due_date, status } = result.data

        const { error } = await supabase
            .from('tasks')
            .update({
                title,
                description,
                priority,
                due_date: due_date ? new Date(due_date).toISOString() : null,
                status,
                updated_at: new Date().toISOString(),
            })
            .eq('id', params.id)
            .eq('user_id', user.id)

        if (error) {
            console.error('Error updating task:', error)
            return fail(500, { message: 'Failed to update task.', data: rawData })
        }

        throw redirect(303, '/')
    },
}
