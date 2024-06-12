<script>
    import Form from "$lib/components/Form.svelte";
    import Input from "$lib/components/Input.svelte";
    import { SnakeCaseToCapitalized } from "$lib/helper";
    import { Alert, Button } from "@sveltestrap/sveltestrap";

    export let username;
    export let email;
    export let phone;
    export let usertype = "user";
    export let visible = false;

    export let update = () => {
        console.log("Updating Profile");
    }
</script>

<Form title="Profile" submit={update}>
    <Alert color="success" isOpen={visible} fade={false} dismissible>
        Profile updated successfully
    </Alert>
    <Input bind:value={email} icon="envelope" placeholder="Email" type="email" />
    <Input bind:value={username} icon="person-circle" placeholder="Name" type="text" />
    <Input bind:value={phone} icon="telephone" placeholder="Phone" type="tel" />
    <Input value={SnakeCaseToCapitalized(usertype)} icon="person-vcard" placeholder="UserType" type="text" disabled />
    <Button type="submit">Update</Button>
</Form>