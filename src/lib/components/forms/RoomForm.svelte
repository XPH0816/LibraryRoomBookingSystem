<script>
    import Form from "$lib/components/Form.svelte";
    import { getRoomType } from "$lib/store";
    import {
        Alert,
        Button,
        Col,
        FormGroup,
        Input,
        Row,
    } from "@sveltestrap/sveltestrap";
    import { SnakeCaseToCapitalized, isNoRoomNumber } from "$lib/helper";
    import { Room } from "$lib/models/room";
    import showModal from "$lib/showModal";

    let rooms = getRoomType();

    export let price = rooms[0].price;
    export let capacity = 1;
    export let type = rooms[0].name;
    export let room_number = 1;
    export let location = "Level 1";
    export let status = "available";

    export let disabled = false;
    export let button = "Create";

    export let success = false;
    export let failure = false;
    export let error = "";

    export let submit = async () => {
        success = failure = false;
        try {
            if (await Room.checkRoomExist(type, room_number)) {
                throw new Error("Room already exist");
            }
            await Room.create({
                type,
                room_number,
                price,
                capacity,
                location,
                status,
            });
            success = true;
        } catch (error) {
            console.error(error);
            if (error.message) showModal("Error", error.message);
            else showModal("Error", "Failed to create room");
        }
    };

    let changeRoom = () => {
        let room = rooms.find((room) => room.name === type);
        price = room.price;
        if (isNoRoomNumber(type)) room_number = 0;
        else room_number = 1;
    };
</script>

<Form title="Room Form" gap={2} {submit}>
    <Alert color="success" isOpen={success} fade={false} dismissible
        >{button} success</Alert
    >
    <Alert color="danger" isOpen={failure} fade={false} dismissible
        >{error}</Alert
    >
    <Row>
        <Col>
            <FormGroup floating label="Room Type">
                <Input
                    type="select"
                    bind:value={type}
                    {disabled}
                    on:change={changeRoom}
                >
                    {#each rooms as room}
                        <option value={room.name}
                            >{SnakeCaseToCapitalized(room.name)}</option
                        >
                    {/each}
                </Input>
            </FormGroup>
        </Col>
    </Row>
    <Row>
        {#if room_number > 0}
            <Col>
                <FormGroup floating label="Room No.">
                    <Input
                        type="number"
                        bind:value={room_number}
                        on:change={() => {
                            if (room_number == 0) room_number = 1;
                        }}
                        min="1"
                        {disabled}
                    ></Input>
                </FormGroup>
            </Col>
        {/if}
        <Col>
            <FormGroup floating label="Price (RM)">
                <Input type="number" bind:value={price} min="0" {disabled} />
            </FormGroup>
        </Col>
        <Col>
            <FormGroup floating label="Capacity">
                <Input type="number" bind:value={capacity} min="1" {disabled} />
            </FormGroup>
        </Col>
    </Row>
    <Row>
        <Col>
            <FormGroup floating label="Location">
                <Input type="text" bind:value={location} required {disabled} />
            </FormGroup>
        </Col>
    </Row>
    <Row>
        <Col>
            <FormGroup floating label="Status">
                <Input type="select" bind:value={status} {disabled}>
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                </Input>
            </FormGroup>
        </Col>
    </Row>
    {#if !disabled}
        <Button type="submit">{button} Room</Button>
    {:else}
        <Button href="/manage/room">Close</Button>
    {/if}
</Form>
