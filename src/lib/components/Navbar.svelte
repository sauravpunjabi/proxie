<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import type { User } from '@supabase/supabase-js';

	export let user: User | null = null;
</script>

<nav class="border-b bg-background">
	<div class="flex h-16 items-center px-4 container mx-auto justify-between">
		<div class="font-bold text-xl">Proxie</div>
		
		{#if user}
			<div class="flex items-center gap-4">
				<span class="text-sm text-muted-foreground">{user.email}</span>
				<form action="/logout" method="POST" use:enhance>
					<Button variant="outline" type="submit">Logout</Button>
				</form>
			</div>
		{/if}
	</div>
</nav>
