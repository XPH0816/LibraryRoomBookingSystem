<script>
    import FeedBackForm from "$lib/components/forms/FeedBackForm.svelte";
    import { Row } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";

    export let data;

    let content;
    let submit;
    let success = false;
    let failure = false;
    let reply;

    onMount(() => {
        if (data.feedback) content = data.feedback.content;
        if (data.reply) reply = data.reply;
        submit = async () => {
            success = failure = false;
            data.feedback.content = content;
            try {
                if (await data.feedback.update()) success = true;
                else throw new Error("Failed to Submit Feedback");
            } catch (e) {
                failure = true;
            }
        };
    });
</script>

<main class="container-fluid">
    <Row>
        {#if data.feedback}
            <FeedBackForm
                bind:content
                feedback={data.feedback}
                data={reply}
                {submit}
                bind:success
                bind:failure
                view={!data.edit}
                close={!data.edit}
                button="Edit"
            />
        {:else}
            <FeedBackForm />
        {/if}
    </Row>
</main>
