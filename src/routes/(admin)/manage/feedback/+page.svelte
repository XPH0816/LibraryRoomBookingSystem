<script>
    import TableCard from "$lib/components/TableCard.svelte";
    import { FeedBackRepo } from "$lib/repos/feedbackRepo";
    import { onMount } from "svelte";

    let list = [];

    onMount(async () => {
        list = await FeedBackRepo.getFeedbacks();
    });
</script>

<main class="container-fluid gap-3">
    <TableCard title="Feedback Table" bind:datas={list} />
</main>