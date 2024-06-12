<script>
    import TableCard from "$lib/components/TableCard.svelte";
    import {
        SnakeCaseToCapitalized,
        formatDate,
        formatTime,
        isFreeRoom,
    } from "$lib/helper";
    import { getBillByPaymentId } from "$lib/models/bill";
    import { getBookingById } from "$lib/models/booking";
    import { getPaymentByBookingId } from "$lib/models/payment";
    import { getUserById } from "$lib/models/user";
    import { HistoryRepo } from "$lib/repos/historyRepo";
    import showModal from "$lib/showModal";
    import { user } from "$lib/store";
    import {
        Button,
        Card,
        CardBody,
        CardFooter,
        CardHeader,
        CardTitle,
        Modal,
    } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";

    let history = [];
    let booking = {};
    let payment;
    let admin;
    let bill;
    let roomName;
    let show = false;

    let showDetails = async (event) => {
        booking = await getBookingById(event.detail.booking_id);
        roomName = event.detail.room;
        booking = booking;
        if (
            booking.status === "approved" ||
            booking.status === "completed" ||
            booking.status === "rejected"
        ) {
            admin = await getUserById(booking.admin_id, "admin");
        }
        if (booking.status === "completed" && !isFreeRoom(roomName)) {
            payment = await getPaymentByBookingId(booking.booking_id);
            bill = await getBillByPaymentId(payment.id);
        }
        show = true;
    };

    let cancelFunction = async () => {
        showModal("Success", "Booking cancelled successfully");
        history = await HistoryRepo.getHistory($user.id);
    };

    onMount(async () => {
        history = await HistoryRepo.getHistory($user.id);
    });
</script>

<main class="container-fluid gap-3">
    <Modal bind:isOpen={show} centered>
        <Card>
            <CardHeader>
                <CardTitle>Booking History</CardTitle>
            </CardHeader>
            <CardBody>
                <table class="table table-striped table-hover">
                    <tbody>
                        <tr>
                            <td>Booking ID: </td>
                            <td>{booking.booking_id}</td>
                        </tr>
                        <tr>
                            <td>Room: </td>
                            <td>{SnakeCaseToCapitalized(roomName)}</td>
                        </tr>
                        <tr>
                            <td>Start Date:</td>
                            <td
                                >{formatDate(
                                    new Date(booking.startDateTime),
                                )}</td
                            >
                        </tr>
                        <tr>
                            <td> End Date: </td>
                            <td>
                                {formatDate(new Date(booking.endDateTime))}
                            </td>
                        </tr>
                        <tr>
                            <td>Start Time:</td>
                            <td>
                                {formatTime(
                                    new Date(booking.startDateTime),
                                )}</td
                            >
                        </tr>
                        <tr>
                            <td> End Time: </td>
                            <td>
                                {formatTime(new Date(booking.endDateTime))}
                            </td>
                        </tr>
                        <tr
                            ><td> Reason: </td>
                            <td>
                                {booking.reason}
                            </td>
                        </tr>
                        {#if booking.status === "approved" || booking.status === "completed" || booking.status === "rejected"}
                            <tr>
                                <td>Operated By: </td>
                                <td>{admin.username}</td>
                            </tr>
                        {/if}
                        {#if booking.status === "completed" && !isFreeRoom(roomName)}
                            <tr>
                                <td>Bill ID: </td>
                                <td>{bill.id}</td>
                            </tr>
                            <tr>
                                <td>Payment ID: </td>
                                <td>{payment.id}</td>
                            </tr>
                            <tr>
                                <td>Payment Date: </td>
                                <td>{formatDate(new Date(payment.datetime))}</td
                                >
                            </tr>
                            <tr>
                                <td>Payment Time: </td>
                                <td>{formatTime(new Date(payment.datetime))}</td
                                >
                            </tr>
                            <tr>
                                <td>Payment Method: </td>
                                <td>{SnakeCaseToCapitalized(payment.method)}</td
                                >
                            </tr>
                            <tr>
                                <td>Amount: </td>
                                <td>{"RM " + payment.amount.toFixed(2)}</td>
                            </tr>
                        {/if}
                        <tr
                            ><td> Status: </td>
                            <td>
                                {SnakeCaseToCapitalized(booking.status)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </CardBody>
            <CardFooter class="d-flex">
                <Button class="ms-auto" on:click={() => (show = false)}
                    >Close</Button
                >
            </CardFooter>
        </Card>
    </Modal>
    <TableCard
        title="History"
        bind:datas={history}
        on:showSuccess={showDetails}
        on:cancelSuccess={cancelFunction}
    />
</main>
