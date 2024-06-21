<script>
    import Form from "$lib/components/Form.svelte";
    import { currentDateTime, getRoomType } from "$lib/store";
    import {
        Alert,
        Button,
        Col,
        FormGroup,
        Input,
        Row,
    } from "@sveltestrap/sveltestrap";
    import {
        getPrice,
        GetEndDateTime,
        SnakeCaseToCapitalized,
        formatDate,
        formatTime,
        isNotHikmahRoomAndEksplorasiRoom,
        toDateTime,
        GetStartDateTime,
        getMaxTime,
    } from "$lib/helper";
    import { getRoomById, getRoomsByType } from "$lib/models/room";
    import { onMount } from "svelte";

    let rooms = getRoomType();
    let price = getPrice(rooms[0].price);
    let roomsAvailable = [];
    let roomName = rooms[0].name;
    let md = 2;

    export let roomId;
    export let checkInDate = formatDate($currentDateTime);
    export let checkOutDate;
    export let checkInTime = formatTime($currentDateTime);
    export let checkOutTime;
    export let reason = "";
    export let success = false;

    onMount(async () => {
        roomsAvailable = await getRoomsByType(roomName);
        roomId
            ? (roomName = (await getRoomById(roomId)).type)
            : (roomId = roomsAvailable[0].room_id);
        price = getPrice(rooms.find((value) => value.name === roomName).price);
        changeDate();
    });

    let changeDate = () => {
        let room = rooms.find((value) => value.name === roomName);
        let endDateTime;
        let date = new Date(
            checkInDate === formatDate($currentDateTime)
                ? $currentDateTime
                : toDateTime(checkInDate, checkInTime),
        );
        if (isNotHikmahRoomAndEksplorasiRoom(roomName)) {
            endDateTime = GetEndDateTime(date, room.duration);
            endDateTime.setHours(22, 0, 0, 0);
            date.setHours(8, 0, 0, 0);
            checkInTime = formatTime(date);
        } else {
            checkInTime = formatTime(date);
            endDateTime = GetEndDateTime(date, room.duration);
        }
        checkOutDate = formatDate(endDateTime);
        checkOutTime = formatTime(endDateTime);
    };

    let changeTime = () => {
        let room = rooms.find((value) => value.name === roomName);
        let dateTime = toDateTime(checkInDate, checkInTime);
        let endDateTime = new Date(dateTime);
        endDateTime = GetEndDateTime(endDateTime, room.duration);
        checkOutTime = formatTime(endDateTime);
        if (checkInDate !== checkOutDate && isNotHikmahRoomAndEksplorasiRoom(roomName)) changeDate();
    };

    let changeEndTime = () => {
        let room = rooms.find((value) => value.name === roomName);
        let dateTime = toDateTime(checkOutDate, checkOutTime);
        let startDateTime = new Date(dateTime);
        startDateTime = GetStartDateTime(startDateTime, room.duration);
        checkInTime = formatTime(startDateTime);
    };

    let changeRoom = async () => {
        let room = rooms.find((room) => room.name === roomName);
        if (room.name === roomName) price = getPrice(room.price);
        changeDate();
        roomsAvailable = await getRoomsByType(roomName);
        if (roomsAvailable.length === 0) roomId = null;
        else roomId = roomsAvailable[0].room_id;
        roomsAvailable.find((room) => room.room_number !== 0)
            ? (md = 2)
            : (md = 4);
    };

    export let submit = () => {
        console.log("submit");
    };
</script>

<Form title="Booking Form" gap={2} {submit}>
    <Alert color="success" isOpen={success} fade={false} dismissible
        >Booking success</Alert
    >
    <Row>
        <Col md={8}>
            <FormGroup floating label="Room Type">
                <Input
                    type="select"
                    bind:value={roomName}
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
        {#key md}
            <Col class={md === 4 ? "d-none" : ""} {md}>
                <FormGroup floating label="Room No.">
                    <Input
                        type="select"
                        disabled={roomsAvailable.find(
                            (room) => room.room_number === 0,
                        )}
                        bind:value={roomId}
                    >
                        {#each roomsAvailable as room}
                            <option value={room.room_id}
                                >{room.room_number}</option
                            >
                        {/each}
                    </Input>
                </FormGroup>
            </Col>
            <Col {md}>
                <FormGroup floating label="Price">
                    <Input type="text" bind:value={price} disabled />
                </FormGroup>
            </Col>
        {/key}
    </Row>
    <Row>
        <Col>
            <FormGroup floating label="Check-in Date">
                <Input
                    type="date"
                    bind:value={checkInDate}
                    on:change={changeDate}
                    min={formatDate($currentDateTime)}
                />
            </FormGroup>
        </Col>
        <Col>
            <FormGroup floating label="Check-out Date">
                <Input type="date" bind:value={checkOutDate} disabled />
            </FormGroup>
        </Col>
    </Row>
    <Row>
        <Col>
            <FormGroup floating label="Check-in Time">
                <Input
                    type="time"
                    bind:value={checkInTime}
                    on:change={changeTime}
                    min={checkInDate === formatDate($currentDateTime)
                        ? formatTime($currentDateTime)
                        : "08:00"}
                    max="20:00"
                    disabled={isNotHikmahRoomAndEksplorasiRoom(roomName) ||
                        ($currentDateTime > getMaxTime() &&
                            checkInDate === formatDate($currentDateTime))}
                />
            </FormGroup>
        </Col>
        <Col>
            <FormGroup floating label="Check-out Time">
                <Input
                    type="time"
                    bind:value={checkOutTime}
                    on:change={changeEndTime}
                    min={checkOutDate === formatDate($currentDateTime)
                        ? formatTime($currentDateTime)
                        : "10:00"}
                    max="22:00"
                    disabled={isNotHikmahRoomAndEksplorasiRoom(roomName) ||
                        ($currentDateTime > getMaxTime() &&
                            checkInDate === formatDate($currentDateTime))}
                />
            </FormGroup>
        </Col>
    </Row>
    <FormGroup floating label="Reason for Booking">
        <Input
            type="text"
            bind:value={reason}
            placeholder="Reason for Booking"
        />
    </FormGroup>
    <Button type="submit">Book Room</Button>
</Form>
