<script lang="ts">
	import { Button } from '$lib/components/ui/button';
    import ModeToggle from '$lib/components/ModeToggle.svelte';
	import type { User } from '@supabase/supabase-js';

	let { user } = $props();
</script>

<nav class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
	<div class="container flex h-14 items-center justify-between">
		<div class="flex items-center gap-2">
			<a href="/" class="flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
				TurboTask
			</a>
		</div>

		<div class="flex items-center gap-4">
            <ModeToggle />
            {#if user}
                <span class="text-sm text-muted-foreground hidden md:inline-block">{user.email}</span>
                <form action="/logout" method="GET">
                    <Button variant="ghost" size="sm" type="submit">Logout</Button>
                </form>
            {/if}
        </div>
	</div>
</nav>
