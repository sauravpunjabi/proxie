<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
    import { Badge } from '$lib/components/ui/badge';
    import * as Select from '$lib/components/ui/select';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';

    let { data } = $props();
    let { tasks } = $derived(data);

    let filter = $state($page.url.searchParams.get('filter') ?? 'all');
    let sort = $state($page.url.searchParams.get('sort') ?? 'created_at');

    function updateParams() {
        const params = new URLSearchParams($page.url.searchParams);
        params.set('filter', filter);
        params.set('sort', sort);
        goto(`?${params.toString()}`);
    }
</script>

<div class="container mx-auto py-10">
    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-muted/50 p-6 rounded-lg border shadow-sm">
        <div>
            <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">My Tasks</h1>
            <p class="text-muted-foreground mt-2">Manage your tasks efficiently and stay organized.</p>
        </div>
        
        <div class="flex flex-wrap gap-4 items-center">
            <Select.Root type="single" bind:value={filter} onValueChange={updateParams}>
                <Select.Trigger class="w-[150px] bg-background">
                    {filter === 'all' ? 'All Status' : filter === 'todo' ? 'To Do' : filter === 'in-progress' ? 'In Progress' : filter === 'completed' ? 'Completed' : 'Filter Status'}
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="all">All Status</Select.Item>
                    <Select.Item value="todo">To Do</Select.Item>
                    <Select.Item value="in-progress">In Progress</Select.Item>
                    <Select.Item value="completed">Completed</Select.Item>
                </Select.Content>
            </Select.Root>

            <Select.Root type="single" bind:value={sort} onValueChange={updateParams}>
                <Select.Trigger class="w-[150px] bg-background">
                    {sort === 'created_at' ? 'Newest First' : sort === 'due_date' ? 'Due Date' : sort === 'priority' ? 'Priority' : 'Sort By'}
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="created_at">Newest First</Select.Item>
                    <Select.Item value="due_date">Due Date</Select.Item>
                    <Select.Item value="priority">Priority</Select.Item>
                </Select.Content>
            </Select.Root>

            <Button href="/tasks/new" class="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-md transition-all hover:scale-105">
                Create Task
            </Button>
        </div>
    </div>

    {#if tasks.length === 0}
        <div class="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-lg bg-muted/20">
            <div class="bg-muted p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </div>
            <h3 class="text-xl font-semibold">No tasks found</h3>
            <p class="text-muted-foreground mt-2 mb-6 max-w-sm">You haven't created any tasks yet. Start by adding a new task to your list.</p>
            <Button href="/tasks/new" variant="outline">Create your first task</Button>
        </div>
    {:else}
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each tasks as task}
                <Card.Root class="group hover:shadow-lg transition-all duration-300 border-l-4 {task.priority === 'high' ? 'border-l-destructive' : task.priority === 'medium' ? 'border-l-primary' : 'border-l-secondary'}">
                    <Card.Header>
                        <div class="flex justify-between items-start">
                            <div class="flex flex-col gap-1">
                                <Card.Title class="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                                    {task.title}
                                    <a href="/tasks/{task.id}/edit" class="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground hover:underline">Edit</a>
                                </Card.Title>
                                <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'} class="w-fit">
                                    {task.priority}
                                </Badge>
                            </div>
                            <form action="?/deleteTask" method="POST" use:enhance>
                                <input type="hidden" name="id" value={task.id} />
                                <Button variant="ghost" size="icon" type="submit" class="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                                    <span class="sr-only">Delete</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </Button>
                            </form>
                        </div>
                        {#if task.due_date}
                            <Card.Description class="flex items-center gap-1 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                                {new Date(task.due_date).toLocaleDateString()}
                            </Card.Description>
                        {/if}
                    </Card.Header>
                    <Card.Content>
                        <p class="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{task.description}</p>
                    </Card.Content>
                    <Card.Footer class="flex justify-between items-center pt-4 border-t bg-muted/20">
                        <Badge variant="outline" class={task.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-200' : ''}>
                            {task.status}
                        </Badge>
                        <form action="?/toggleStatus" method="POST" use:enhance>
                            <input type="hidden" name="id" value={task.id} />
                            <input type="hidden" name="currentStatus" value={task.status} />
                            <Button variant="ghost" size="sm" type="submit" class="text-xs hover:bg-primary/10 hover:text-primary">
                                {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                            </Button>
                        </form>
                    </Card.Footer>
                </Card.Root>
            {/each}
        </div>
    {/if}
</div>
