<script>
    import TableCard from "$lib/components/TableCard.svelte";
    import { FeedBackRepo } from "$lib/repos/feedbackRepo";
    import { user } from "$lib/store";
    import { Button, Icon } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";

    let feedbacks = [];

    onMount(async () => {
        feedbacks = await FeedBackRepo.getUserFeedback($user.id);
    });
</script>

<main class="container-fluid d-flex flex-column gap-3">
    <Button href="/feedback/form" class="ms-auto"
        ><Icon name="plus" />New</Button
    >
    <TableCard bind:datas={feedbacks} title="Your Feedback" />
</main>
