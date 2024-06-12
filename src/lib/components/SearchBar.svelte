<script>
    import IconButton from "$lib/components/IconButton.svelte";
    import {
        SnakeCaseToCapitalized,
        formatDate,
        formatTime,
        getMaxTime,
        isNotHikmahRoomAndEksplorasiRoom,
    } from "$lib/helper";
    import { currentDateTime, getRoomType } from "$lib/store";
    import {
        InputGroup,
        InputGroupText,
        Input,
    } from "@sveltestrap/sveltestrap";

    export let room;
    export let date = formatDate($currentDateTime);
    export let time = formatTime($currentDateTime);

    export let search = () => {
        console.log(room);
        console.log(date);
        console.log(time);
        console.log("search");
    };
</script>

<form on:submit|preventDefault={search}>
    <InputGroup>
        <Input type="select" bind:value={room}>
            {#each getRoomType() as type}
                <option value={type.name}
                    >{SnakeCaseToCapitalized(type.name)}</option
                >
            {/each}
        </Input>
        <Input type="date" bind:value={date} min={formatDate($currentDateTime)}
        ></Input>
        {#if !isNotHikmahRoomAndEksplorasiRoom(room)}
            <Input
                type="time"
                bind:value={time}
                min={date === formatDate($currentDateTime) 
                    ? formatTime($currentDateTime)
                    : "08:00"}
                max="20:00"
                disabled={$currentDateTime > getMaxTime() && date === formatDate($currentDateTime)}
            ></Input>
        {/if}
        <InputGroupText>
            <IconButton icon="bi-search" type="submit" />
        </InputGroupText>
    </InputGroup>
</form>
