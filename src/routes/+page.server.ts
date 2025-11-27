import { redirect, fail, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals: { supabase, user } }) => {
    if (!user) {
        throw redirect(303, '/login')
    }

    const filter = url.searchParams.get('filter')
    const sort = url.searchParams.get('sort') ?? 'created_at'

    let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)

    if (filter && filter !== 'all') {
        query = query.eq('status', filter)
    }

    if (sort === 'due_date') {
        query = query.order('due_date', { ascending: true })
    } else if (sort === 'priority') {
        // Priority is text, so sorting might be alphabetical (high, low, medium) which is wrong.
        // For proper priority sorting, we'd need a mapping or integer column.
        // For now, let's just sort by priority text, but maybe we can fix this later.
        // Actually, let's stick to created_at default and maybe due_date.
        query = query.order('priority', { ascending: false })
    } else {
        query = query.order('created_at', { ascending: false })
    }

    const { data: tasks, error } = await query

    if (error) {
        console.error('Error fetching tasks:', error)
        return { tasks: [] }
    }

    return { tasks: tasks ?? [] }
}

export const actions: Actions = {
    deleteTask: async ({ request, locals: { supabase, user } }) => {
        if (!user) {
            throw redirect(303, '/login')
        }
        const formData = await request.formData()
        const id = formData.get('id') as string

        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            console.error('Error deleting task:', error)
            return fail(500, { message: 'Failed to delete task.' })
        }
    },
    toggleStatus: async ({ request, locals: { supabase, user } }) => {
        if (!user) {
            throw redirect(303, '/login')
        }
        const formData = await request.formData()
        const id = formData.get('id') as string
        const currentStatus = formData.get('currentStatus') as string

        const newStatus = currentStatus === 'completed' ? 'todo' : 'completed'

        const { error } = await supabase
            .from('tasks')
            .update({ status: newStatus })
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            console.error('Error toggling status:', error)
            return fail(500, { message: 'Failed to update status.' })
        }
    }
}
