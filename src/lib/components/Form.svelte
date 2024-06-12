<script>
    import {
        Card,
        CardTitle,
        CardBody,
        Container,
        CardHeader,
    } from "@sveltestrap/sveltestrap";
    export let title = undefined;
    export let submit;
    export let gap = 2;
    export let center = false;
</script>

<Card>
    {#if title}
        <CardTitle>
            <CardHeader>{title}</CardHeader>
        </CardTitle>
    {/if}
    <CardBody>
        <Container fluid>
            <form
                class={center
                    ? `d-flex flex-column gap-${gap} justify-content-center align-items-center`
                    : `d-flex flex-column gap-${gap}`}
                on:submit|preventDefault={submit}
            >
                <slot />
            </form>
        </Container>
    </CardBody>
</Card>
