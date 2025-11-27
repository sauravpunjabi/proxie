<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title class="text-2xl font-bold text-center">Login</Card.Title>
			<Card.Description class="text-center">Enter your credentials to access your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" action="?/login" use:enhance class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input id="email" name="email" type="email" placeholder="m@example.com" required />
				</div>
				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input id="password" name="password" type="password" required />
				</div>
				
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-2">
						<Checkbox id="remember" name="remember" />
						<Label for="remember" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Remember me</Label>
					</div>
					<a href="/forgot-password" class="text-sm text-primary hover:underline">Forgot password?</a>
				</div>
				
				{#if form?.error}
					<div class="text-sm font-medium text-red-500 text-center">
						{form.error}
					</div>
				{/if}

				<Button type="submit" class="w-full" disabled={form?.loading}>
					{#if form?.loading}
						Logging in...
					{:else}
						Login
					{/if}
				</Button>
			</form>
		</Card.Content>
		<Card.Footer class="flex justify-center">
			<p class="text-sm text-gray-500">
				Don't have an account? <a href="/register" class="text-primary hover:underline">Sign up</a>
			</p>
		</Card.Footer>
	</Card.Root>
</div>
