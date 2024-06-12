<script>
    import TableCard from "$lib/components/TableCard.svelte";
    import { userManageRepo } from "$lib/repos/userManageRepo";
    import { onMount } from "svelte";

    let list = [];

    onMount(async () => {
        list = await userManageRepo.getUsers();
    });
</script>

<main class="container-fluid gap-3">
    <TableCard title="User List" bind:datas={list} />
</main>
