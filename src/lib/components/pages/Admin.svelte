<script>
    import { BookingManageRepo } from "$lib/repos/bookingManageRepo";
    import { onMount } from "svelte";
    import TableCard from "../TableCard.svelte";
    import {
        Button,
        Card,
        CardBody,
        CardFooter,
        CardHeader,
        CardTitle,
        Modal,
    } from "@sveltestrap/sveltestrap";
    import { getBookingById } from "$lib/models/booking";
    import {
        SnakeCaseToCapitalized,
        formatDate,
        formatTime,
        isFreeRoom,
    } from "$lib/helper";
    import { getBillByPaymentId } from "$lib/models/bill";
    import { getPaymentByBookingId } from "$lib/models/payment";
    import showModal from "$lib/showModal";
    import { getUserById } from "$lib/models/user";

    let list = [];
    let show = false;

    let booking;
    let user;
    let admin;
    let payment;
    let bill;
    let roomName;

    onMount(async () => {
        list = await BookingManageRepo.getBookings();
    });

    let showDetails = async (event) => {
        booking = await getBookingById(event.detail.no);
        user = await getUserById(booking.user_id, "user");
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

    let approve = (event) => {
        showModal("Success", "Booking approved successfully");
        let booking = list.find((b) => b.no === event.detail.no);
        booking.status = isFreeRoom(event.detail.room) ? "completed" : "approved";
        booking.action = {
            show: () => {
                () => {};
            },
        };
        list = list;
    };

    let reject = (event) => {
        showModal("Success", "Booking rejected successfully");
        let booking = list.find((b) => b.no === event.detail.no);
        booking.status = "rejected";
        booking.action = {
            show: () => {
                () => {};
            },
        };
        list = list;
    };
</script>

<main class="container-fluid gap-3">
    <Modal bind:isOpen={show} centered>
        <Card>
            <CardHeader>
                <CardTitle>Booking Detail</CardTitle>
            </CardHeader>
            <CardBody>
                <table class="table table-striped table-hover">
                    <tbody>
                        <tr>
                            <td>Booking ID :</td>
                            <td>{booking.booking_id}</td>
                        </tr>
                        <tr>
                            <td>User Id:</td>
                            <td>{booking.user_id}</td>
                        </tr>
                        <tr>
                            <td>Username:</td>
                            <td>{user.username}</td>
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
                                <td>{payment.amount}</td>
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
        title="Booking List"
        bind:datas={list}
        on:approveSuccess={approve}
        on:rejectSuccess={reject}
        on:showSuccess={showDetails}
    />
</main>
