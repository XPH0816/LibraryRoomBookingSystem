<script>
    import {
        Card,
        CardBody,
        CardHeader,
        CardTitle,
    } from "@sveltestrap/sveltestrap";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import { SearchRepo } from "$lib/repos/searchRepo";
    import TableCard from "../TableCard.svelte";
    import showModal from "$lib/showModal";
    import { currentDateTime } from "$lib/store";
    import { formatDate, getMaxTime } from "$lib/helper";

    let room;
    let date;
    let time;

    let searched = false;
    let searchRooms = [];

    let search = async () => {
        try {
            if (
                $currentDateTime > getMaxTime() &&
                date === formatDate($currentDateTime)
            ) throw new Error("You can't book room after 20:00 or cannot book room for today anymore.");
                searched = true;
            searchRooms = await SearchRepo.getSearchResult(room, date, time);
        } catch (error) {
            if (error.message) showModal("Error", error.message);
            else showModal("Error", "Failed to search room");
        }
    };
</script>

<main class="container-fluid gap-3">
    <div id="modal"></div>
    <div class="container">
        <SearchBar bind:room bind:date bind:time {search} />
    </div>
    {#if searched && searchRooms.length == 0}
        <Card class="w-100">
            <CardHeader>
                <CardTitle>No Room Available</CardTitle>
            </CardHeader>
            <CardBody>
                <p class="text-center">
                    There is no room available for the selected date and time.
                </p>
            </CardBody>
        </Card>
    {:else if searchRooms.length > 0}
        <TableCard title="Search Result" bind:datas={searchRooms} />
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
