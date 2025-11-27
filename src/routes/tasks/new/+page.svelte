<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import * as Card from '$lib/components/ui/card';
    import { Loader2 } from '@lucide/svelte';

	let { form } = $props();
    let loading = $state(false);
    let priority = $state('medium');

    // Update priority when form data returns (if error)
    $effect(() => {
        if (form?.data?.priority) {
            priority = form.data.priority;
        }
    });
</script>

<div class="container mx-auto py-10 max-w-2xl">
	<Card.Root>
		<Card.Header>
			<Card.Title>Create New Task</Card.Title>
			<Card.Description>Add a new task to your list.</Card.Description>
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
					<Input id="title" name="title" placeholder="Buy groceries" value={form?.data?.title ?? ''} />
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
                        value={form?.data?.description ?? ''}
					/>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-2">
						<Label>Priority</Label>
                        <input type="hidden" name="priority" value={priority} />
						<Select.Root type="single" bind:value={priority}>
							<Select.Trigger>
								<Select.Value placeholder="Select priority" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="low">Low</Select.Item>
								<Select.Item value="medium">Medium</Select.Item>
								<Select.Item value="high">High</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>

					<div class="space-y-2">
						<Label for="due_date">Due Date</Label>
						<Input id="due_date" name="due_date" type="date" value={form?.data?.due_date ?? ''} />
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
                        Create Task
                    </Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
