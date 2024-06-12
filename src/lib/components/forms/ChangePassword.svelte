<script>
    import Form from "$lib/components/Form.svelte";
    import Input from "$lib/components/Input.svelte";
    import { Alert, Button, Col, Row } from "@sveltestrap/sveltestrap";

    export let currentPassword;
    export let password;

    export let invalid = false;

    let gap = 3;

    export let update = () => {
        console.log("Updating Profile");
    };
    export let visible = true;
</script>

<Form title="Change Password" {gap} submit={update}>
    <Alert
        color="success"
        isOpen={visible}
        fade={false}
        class="mb-0"
        dismissible
    >
        Password Changed Successfully
    </Alert>
    <Row>
        <Col>
            <Input
                bind:value={currentPassword}
                icon="key"
                placeholder="Current Password"
                type="password"
                feedback="Please enter correct password"
                {invalid}
            />
        </Col>
        <Col>
            <Input
                bind:value={password}
                icon="shield-lock"
                placeholder="New Password"
                type="password"
            />
        </Col>
    </Row>
    <Button type="submit" disabled={!currentPassword || !password}
        >Change Password</Button
    >
</Form>
