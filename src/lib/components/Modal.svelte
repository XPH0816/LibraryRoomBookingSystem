<script>
    import {
        Button,
        Card,
        CardBody,
        CardFooter,
        CardHeader,
        CardTitle,
        Modal,
    } from "@sveltestrap/sveltestrap";

    let instance;

    export let show = false;
    export let title = "Title";
    export let msg = "Enter your message here";
    export let close = () => {
        instance.$destroy();
    };
</script>

<Modal bind:isOpen={show} bind:this={instance} on:close={close} centered>
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardBody>
            <p>{msg}</p>
        </CardBody>
        <CardFooter class="d-flex">
            <Button
                class="ms-auto"
                on:click={() => {
                    show = false;
                }}>Close</Button
            >
        </CardFooter>
    </Card>
</Modal>
