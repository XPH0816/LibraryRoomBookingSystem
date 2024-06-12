<script>
    import { goto } from "$app/navigation";
    import FeedBackForm from "$lib/components/forms/FeedBackForm.svelte";
    import { formatDate } from "$lib/helper.js";
    import { closeFeedback } from "$lib/models/feedback.js";
    import { user } from "$lib/store.js";
    import { Row } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";

    export let data;

    let content;
    let submit;
    let success = false;
    let failure = false;
    let view = false;
    let reply;
    let close;

    onMount(() => {
        if (data.feedback) content = data.feedback.content;
        if (data.disabled) view = close = true;
        if (data.reply) reply = data.reply;
        else
            reply = data.disabled
                ? {
                      user_id: data.user.username,
                      date: formatDate(new Date()),
                      status: data.feedback.status,
                  }
                : {
                      user_id: data.user.username,
                      admin_id: $user.id,
                      date: formatDate(new Date()),
                      status: data.feedback.status,
                  };
        submit = async () => {
            success = failure = false;
            data.feedback.content = content;
            data.feedback.admin_id = $user.id;
            data.feedback.comment = reply.comment;
            try {
                if (await data.feedback.update()) {
                    success = true;
                    await closeFeedback(data.feedback.id);
                    goto("/manage/feedback");
                } else throw new Error("Failed to Submit Feedback");
            } catch (e) {
                failure = true;
            }
        };
    });
</script>

<main class="container-fluid">
    <Row>
        <FeedBackForm
            bind:content
            bind:success
            bind:failure
            feedback={data.feedback}
            bind:data={reply}
            button="Reply"
            disabled={data.disabled}
            {close}
            {submit}
            {view}
        />
    </Row>
</main>
