<script>
    import {
        InputGroup,
        InputGroupText,
        Input,
        Icon,
    
    } from "@sveltestrap/sveltestrap";
    export let value = "";
    export let icon = "person-circle"; 
    export let placeholder = "Please enter Something";
    /** @type {import("@sveltestrap/sveltestrap").InputType}*/
    export let type = "text";
    export let feedback = "";
    export let readonly = false;
    export let disabled = false;
    export let invalid = false;
</script>

<InputGroup>
    <InputGroupText>
        <Icon name={icon} />
    </InputGroupText>
    <Input bind:value {placeholder} type={type} {feedback} {readonly} {disabled} {invalid} />
</InputGroup>
