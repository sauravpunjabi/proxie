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
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 class="text-3xl font-bold">My Tasks</h1>
        
        <div class="flex gap-4 items-center">
            <Select.Root type="single" bind:value={filter} onValueChange={updateParams}>
                <Select.Trigger class="w-[150px]">
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
                <Select.Trigger class="w-[150px]">
                    {sort === 'created_at' ? 'Newest First' : sort === 'due_date' ? 'Due Date' : sort === 'priority' ? 'Priority' : 'Sort By'}
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="created_at">Newest First</Select.Item>
                    <Select.Item value="due_date">Due Date</Select.Item>
                    <Select.Item value="priority">Priority</Select.Item>
                </Select.Content>
            </Select.Root>

            <Button href="/tasks/new">Create Task</Button>
        </div>
    </div>

    {#if tasks.length === 0}
        <div class="text-center py-10 text-muted-foreground">
            <p>No tasks found. Create one to get started!</p>
        </div>
    {:else}
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {#each tasks as task}
                <Card.Root>
                    <Card.Header>
                        <div class="flex justify-between items-start">
                            <div class="flex flex-col gap-1">
                                <Card.Title class="text-lg flex items-center gap-2">
                                    {task.title}
                                    <a href="/tasks/{task.id}/edit" class="text-xs text-muted-foreground hover:underline">Edit</a>
                                </Card.Title>
                                <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                                    {task.priority}
                                </Badge>
                            </div>
                            <form action="?/deleteTask" method="POST" use:enhance>
                                <input type="hidden" name="id" value={task.id} />
                                <Button variant="ghost" size="icon" type="submit" class="h-6 w-6 text-destructive hover:text-destructive/90">
                                    <span class="sr-only">Delete</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </Button>
                            </form>
                        </div>
                        {#if task.due_date}
                            <Card.Description>Due: {new Date(task.due_date).toLocaleDateString()}</Card.Description>
                        {/if}
                    </Card.Header>
                    <Card.Content>
                        <p class="text-sm text-muted-foreground line-clamp-3">{task.description}</p>
                    </Card.Content>
                    <Card.Footer class="flex justify-between items-center">
                        <Badge variant="outline">{task.status}</Badge>
                        <form action="?/toggleStatus" method="POST" use:enhance>
                            <input type="hidden" name="id" value={task.id} />
                            <input type="hidden" name="currentStatus" value={task.status} />
                            <Button variant="outline" size="sm" type="submit">
                                {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                            </Button>
                        </form>
                    </Card.Footer>
                </Card.Root>
            {/each}
        </div>
    {/if}
</div>
