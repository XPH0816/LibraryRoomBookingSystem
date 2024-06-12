<script>
    import RoomForm from "$lib/components/forms/RoomForm.svelte";
    import { Room } from "$lib/models/room.js";

    export let data;

    let price;
    let capacity;
    let type;
    let room_number;
    let location;
    let status;

    if (data.room) {
        price = data.room.price;
        capacity = data.room.capacity;
        type = data.room.type;
        room_number = data.room.room_number;
        location = data.room.location;
        status = data.room.status;
    }

    let disabled = data.disabled;
    let button;

    let submit;
    let success;
    let failure;
    let error;

    if (data.disabled === false) {
        button = "Update";
        submit = async () => {
            success = failure = false;
            try {
                data.room.price = price;
                data.room.capacity = capacity;
                data.room.type = type;
                data.room.room_number = room_number;
                data.room.location = location;
                data.room.status = status;
                await data.room.update();
                success = true;
            } catch (err) {
                if (err.message) error = err.message;
                else if (err.includes("duplicate") || err.includes("Duplicate")) error = "Room already exist";
                else error = err;
                failure = true;
            }
        };
    }
</script>

<main class="container-fluid d-flex flex-column gap-2">
    <RoomForm
        bind:price
        bind:capacity
        bind:type
        bind:room_number
        bind:location
        bind:status
        bind:success
        bind:failure
        bind:error
        {button}
        {submit}
        {disabled}
    />
</main>
