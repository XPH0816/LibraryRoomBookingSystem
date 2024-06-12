<script>
    import { goto } from "$app/navigation";
    import Form from "$lib/components/Form.svelte";
    import { SnakeCaseToCapitalized, formatDate } from "$lib/helper";
    import { FeedBack } from "$lib/models/feedback";
    import { currentDateTime, user } from "$lib/store";
    import {
        Alert,
        Button,
        Col,
        FormGroup,
        Input,
        Row,
    } from "@sveltestrap/sveltestrap";

    export let data = {};

    export let feedback = {};

    export let content = "Enter your content here";
    export let button = "Save";

    export let success = false;
    export let failure = false;
    export let msg = "Failed to Submit Feedback";

    export let view = false;

    export let disabled = true;

    export let close = false;

    export let submit = async () => {
        success = failure = false;
        try {
            let feedback = new FeedBack({
                content,
                user_id: $user.id,
                date: formatDate($currentDateTime),
            });
            if (await feedback.save()) success = true;
            else throw new Error("Failed to Submit Feedback");
        } catch (e) {
            failure = true;
            msg = "Failed to Submit Feedback";
        }
    };

    let closeFeedBack = async () => {
        try {
            failure = false;
            $user.usertype != "admin"
                ? goto("/feedback")
                : goto("/manage/feedback");
        } catch (e) {
            failure = true;
            msg = "Failed to Close Feedback";
        }
    };
</script>

<Form title="Feedback Form" {submit} gap={0}>
    {#if failure}
        <Alert color="danger" isOpen={failure} fade={false} dismissible>
            {msg}
        </Alert>
    {:else if success}
        <Alert color="success" isOpen={success} fade={false} dismissible>
            Feedback Submitted Successfully
        </Alert>
    {/if}
    {#if feedback.id}
        <FormGroup floating label="Feedback ID">
            <Input type="text" value={feedback.id} disabled />
        </FormGroup>
    {/if}
    {#if data.user_id && data.date}
        <Row>
            <Col>
                <FormGroup floating label="User ID">
                    <Input type="text" bind:value={data.user_id} disabled />
                </FormGroup>
            </Col>
            <Col>
                <FormGroup floating label="Date">
                    <Input type="date" bind:value={data.date} disabled />
                </FormGroup>
            </Col>
        </Row>
    {:else if data.date}
        <FormGroup floating label="Date">
            <Input type="date" bind:value={data.date} disabled />
        </FormGroup>
    {:else}
        <FormGroup floating label="Date">
            <Input type="date" value={formatDate($currentDateTime)} disabled />
        </FormGroup>
    {/if}
    <FormGroup floating label="Feedback Content">
        <Input
            type="text"
            bind:value={content}
            placeholder="Enter Your content here"
            disabled={view || !disabled}
        />
    </FormGroup>
    {#if data.admin_id}
        <FormGroup floating label="Admin ID">
            <Input type="text" bind:value={data.admin_id} disabled />
        </FormGroup>
    {/if}
    {#if !disabled || data.comment}
        <FormGroup floating label="Reply">
            <Input type="text" bind:value={data.comment} {disabled} />
        </FormGroup>
    {/if}
    {#if data.status}
        <FormGroup floating label="Status">
            <Input
                type="text"
                value={SnakeCaseToCapitalized(data.status)}
                disabled
            />
        </FormGroup>
    {/if}
    {#if close}
        <Button type="button" on:click={closeFeedBack}>Close</Button>
    {:else}
        <Button type="submit" disabled={view || !content}>{button}</Button>
    {/if}
</Form>
