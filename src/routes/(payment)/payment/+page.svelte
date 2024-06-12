<script>
    import { goto } from "$app/navigation";
    import Form from "$lib/components/Form.svelte";
    import { SnakeCaseToCapitalized } from "$lib/helper.js";
    import { Bill } from "$lib/models/bill";
    import { Payment, getPaymentMethods } from "$lib/models/payment";
    import { Button, FormGroup, Input } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";

    export let data;

    let method;

    let methods = [];

    onMount(async () => {
        methods = await getPaymentMethods();
        method = methods[0];
    });

    let pay = async () => {
        try {
            let payment = await Payment.create({
                booking_id: data.booking.booking_id,
                amount: data.amount,
                method,
                payment_status: "completed",
            });
            let bill = await Bill.create({
                payment_id: payment.id,
                amount: payment.amount,
                status: "completed",
            });
            data.booking.status = "completed";
            await data.booking.update();

            goto("/history");
        } catch (e) {
            console.error(e);
        }
    };
</script>

<main class="container-fluid d-flex flex-column">
    <Form title="Payment" submit={pay} gap={2}>
        <h2>Booking ID: {data.booking.booking_id}</h2>
        <FormGroup floating label="Amount">
            <input
                type="text"
                class="form-control"
                value={data.amount}
                readonly
            />
        </FormGroup>
        <FormGroup floating label="Method">
            <Input type="select" bind:value={method}>
                {#each methods as method}
                    <option value={method}
                        >{SnakeCaseToCapitalized(method)}</option
                    >
                {/each}
            </Input>
        </FormGroup>
        <Button color="primary" type="submit">Pay Now</Button>
    </Form>
</main>

<style>
    main {
        height: 100vh;
        justify-content: center;
        align-items: center;
    }
</style>
