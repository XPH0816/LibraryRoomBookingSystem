<script>
    import BookingForm from "$lib/components/forms/BookingForm.svelte";
    import { formatDate, getMaxTime, logUserActivity, toDateTime } from "$lib/helper";
    import { Booking, checkAvailability } from "$lib/models/booking";
    import showModal from "$lib/showModal";
    import { currentDateTime, user } from "$lib/store";

    let roomId;
    let checkInDate;
    let checkOutDate;
    let checkInTime;
    let checkOutTime;
    let reason;
    let success = false;

    let submit = async () => {
        success = false;
        try {
            if (
                $currentDateTime > getMaxTime() &&
                checkInDate === formatDate($currentDateTime)
            ) {
                throw new Error(
                    "You can't book room after 20:00 or cannot book room for today anymore.",
                );
            }
            if (
                !(await checkAvailability(
                    roomId,
                    toDateTime(checkInDate, checkInTime),
                    toDateTime(checkOutDate, checkOutTime),
                ))
            ) {
                throw new Error(
                    "Room is not available for the selected time period",
                );
            }
            if(roomId == undefined) throw new Error("Please select a room");
            if(!reason) throw new Error("Please enter a reason");
            let booking = new Booking({
                room_id: roomId,
                user_id: $user.id,
                start_datetime: toDateTime(checkInDate, checkInTime),
                end_datetime: toDateTime(checkOutDate, checkOutTime),
                reason,
            });
            if (await booking.save()) success = true;
            else throw new Error("Booking failed");
            logUserActivity(`Booked room ID: ${roomId}`, $user.email);
        } catch (e) {
            console.error(e);
            if (e.message) showModal("Failed", e.message);
            else showModal("Failed", "Booking failed");
        }
    };
</script>

<main class="container-fluid">
    <BookingForm
        bind:roomId
        bind:checkInDate
        bind:checkOutDate
        bind:checkInTime
        bind:checkOutTime
        bind:reason
        bind:success
        {submit}
    />
</main>
