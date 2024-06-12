<script>
    import TableCard from "$lib/components/TableCard.svelte";
    import { RoomManageRepo } from "$lib/repos/roomManageRepo";
    import {
        Card,
        CardTitle,
        CardBody,
        CardHeader,
        Button,
        Icon,
        Modal,
        CardFooter,
    } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";

    let rooms = [];

    let deleteSuccess = false;
    let deleteFunction = (event) => {
        deleteSuccess = true;
        rooms = rooms.filter((r) => r.room_id !== event.detail.room_id);
    };

    onMount(async () => {
        rooms = await RoomManageRepo.getRooms();
    });
</script>

<main class="container-fluid d-flex flex-column gap-2">
    <Button href="/manage/room/form" class="ms-auto"
        ><Icon name="plus-lg" /> New</Button
    >
    <Modal bind:isOpen={deleteSuccess} centered>
        <Card>
            <CardHeader>
                <CardTitle>Success</CardTitle>
            </CardHeader>
            <CardBody>
                <p>Room deleted successfully</p>
            </CardBody>
            <CardFooter class="d-flex">
                <Button class="ms-auto" on:click={() => (deleteSuccess = false)}>Close</Button>
            </CardFooter>
        </Card>
    </Modal>
    <TableCard
        title="Room Table"
        bind:datas={rooms}
        on:deleteSuccess={deleteFunction}
    />
</main>
