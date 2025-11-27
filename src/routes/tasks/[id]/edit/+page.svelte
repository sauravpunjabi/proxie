<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import * as Card from '$lib/components/ui/card';
    import { Loader2 } from '@lucide/svelte';

	let { data, form } = $props();
    let { task } = $derived(data);
    
    let loading = $state(false);
    let priority = $state(task.priority);
    let status = $state(task.status);

    // Update state if form returns with errors/data
    $effect(() => {
        if (form?.data?.priority) priority = form.data.priority;
        if (form?.data?.status) status = form.data.status;
    });
</script>

<div class="container mx-auto py-10 max-w-2xl">
	<Card.Root>
		<Card.Header>
			<Card.Title>Edit Task</Card.Title>
			<Card.Description>Update task details.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				method="POST"
				use:enhance={() => {
                    loading = true;
					return async ({ update }) => {
                        loading = false;
						await update();
					};
				}}
				class="space-y-6"
			>
				<div class="space-y-2">
					<Label for="title">Title</Label>
					<Input id="title" name="title" placeholder="Buy groceries" value={form?.data?.title ?? task.title} />
					{#if form?.errors?.title}
						<p class="text-sm text-destructive">{form.errors.title[0]}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="description">Description</Label>
					<Textarea
						id="description"
						name="description"
						placeholder="Milk, Bread, Eggs..."
                        value={form?.data?.description ?? task.description ?? ''}
					/>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-2">
						<Label>Priority</Label>
                        <input type="hidden" name="priority" value={priority} />
						<Select.Root type="single" bind:value={priority}>
							<Select.Trigger>
                                {priority === 'low' ? 'Low' : priority === 'medium' ? 'Medium' : 'High'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="low">Low</Select.Item>
								<Select.Item value="medium">Medium</Select.Item>
								<Select.Item value="high">High</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>

                    <div class="space-y-2">
						<Label>Status</Label>
                        <input type="hidden" name="status" value={status} />
						<Select.Root type="single" bind:value={status}>
							<Select.Trigger>
                                {status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Completed'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="todo">To Do</Select.Item>
								<Select.Item value="in-progress">In Progress</Select.Item>
								<Select.Item value="completed">Completed</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>

					<div class="space-y-2">
						<Label for="due_date">Due Date</Label>
						<Input id="due_date" name="due_date" type="date" value={form?.data?.due_date ?? (task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '')} />
					</div>
				</div>

                {#if form?.message}
                    <p class="text-sm text-destructive">{form.message}</p>
                {/if}

				<div class="flex justify-end gap-4">
					<Button variant="outline" href="/">Cancel</Button>
					<Button type="submit" disabled={loading}>
                        {#if loading}
                            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                        {/if}
                        Update Task
                    </Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
