<script>
    import Admin from "$lib/components/pages/Admin.svelte";
    import User from "$lib/components/pages/User.svelte";
    import { user } from "$lib/store";
</script>

{#if $user.usertype == "admin"}
    <Admin />
{:else}
    <User />
{/if}
