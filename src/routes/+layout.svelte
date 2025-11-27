<script>import "../app.css";
import favicon from '$lib/assets/favicon.svg';
import { ModeWatcher } from 'mode-watcher';

import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	import Navbar from '$lib/components/Navbar.svelte';

	let { children, data } = $props();
	let { session, supabase, user } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});</script>

<svelte:head>
	<link rel="icon" href="{favicon}" />
</svelte:head>

<Navbar {user} />

<ModeWatcher />
{@render children()}
