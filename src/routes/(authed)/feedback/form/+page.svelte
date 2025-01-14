<script>
    import FeedBackForm from "$lib/components/forms/FeedBackForm.svelte";
    import { logUserActivity } from "$lib/helper.js";
    import { user } from "$lib/store.js";
    import { Row } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";

    export let data;

    let content;
    let submit;
    let success = false;
    let failure = false;
    let reply;
    let msg;

    onMount(() => {
        if (data.feedback) content = data.feedback.content;
        if (data.reply) reply = data.reply;
        submit = async () => {
            success = failure = false;
            try {
                if (!content) throw new Error("Content is Required");
                data.feedback.content = content;
                if (await data.feedback.update()) success = true;
                else throw new Error("Failed to Submit Feedback");
                logUserActivity("Updated Feedback ID: " + data.feedback.id, $user.email);
            } catch (e) {
                failure = true;
                if(e.message) msg = e.message;
                else msg = "Failed to Submit Feedback";
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
                bind:msg
                view={!data.edit}
                close={!data.edit}
                button="Edit"
            />
        {:else}
            <FeedBackForm />
        {/if}
    </Row>
</main>
