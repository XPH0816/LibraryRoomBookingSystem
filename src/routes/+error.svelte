<script>
	import { page } from "$app/stores";
	import { emoji } from "$lib/emoji.js";
	import { Button } from "@sveltestrap/sveltestrap";
	import { getItem } from "$lib/helper";
</script>

<main class="gap-2">
	<h1>
		{$page.status}
		{emoji[$page.status] ?? emoji[500]}
	</h1>
	<h2>
		{$page.error.message}
	</h2>
	<p>Sorry, something went wrong.</p>
	{#if getItem("token")}
		<Button href="/home">Back to Home</Button>
	{:else}
		<Button href="/">Back to Login</Button>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
	p {
		font-size: 1em;
	}
</style>
