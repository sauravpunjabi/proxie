<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="container mx-auto py-10">
	<Card.Root>
		<Card.Header>
			<Card.Title>Welcome to Proxie</Card.Title>
			<Card.Description>Manage your tasks efficiently.</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="mb-4">You are successfully logged in!</p>
			<Button href="/tasks/new">Create a Task</Button>
		</Card.Content>
	</Card.Root>
</div>
