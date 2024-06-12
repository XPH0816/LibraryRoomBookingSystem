<script>
    import {
        Row,
        Button,
        Input as BInput,
        Container,
    } from "@sveltestrap/sveltestrap";
    import Form from "../Form.svelte";
    import Input from "../Input.svelte";

    export let email = "";
    export let password = "";
    export let phone = "";
    /** @type {"student"|"staff"|"visitor"} */
    export let usertype = "student";

    export let register = () => {
        console.log("Registering");
    };
</script>

<Form title="Register" submit={register}>
    <Row class="justify-content-center">
        <img src="/icon.png" alt="PTTA Logo" />
    </Row>
    <Input bind:value={email} type="email" placeholder="Enter your email" />
    <Input
        bind:value={password}
        placeholder="Enter your password"
        icon="key"
        type="password"
    />
    <Input
        bind:value={phone}
        placeholder="Enter your phone number"
        icon="phone"
        type="tel"
    />
    <div class="d-flex justify-content-around">
        {#each ["student", "staff", "visitor"] as value}
            <BInput
                class="form-check-inline"
                type="radio"
                bind:group={usertype}
                {value}
                label={value.charAt(0).toUpperCase() + value.slice(1)}
            />
        {/each}
    </div>
    <Button
        class="w-100"
        disabled={email && password && phone ? false : true}
        type="submit">Register</Button
    >
    <Container fluid class="d-flex justify-content-center">
        <a href="/">Already have an account? Login here</a>
    </Container>
</Form>

<style>
    img {
        width: 150px;
    }
</style>