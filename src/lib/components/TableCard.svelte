<script>
    import {
        SnakeCaseToCapitalized,
        formatDate,
        formatTime,
        isDateTimeValid,
        isFunction,
        isNumber,
        isObject,
    } from "$lib/helper";
    import {
        Button,
        Card,
        CardBody,
        CardHeader,
        CardTitle,
        Table,
    } from "@sveltestrap/sveltestrap";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let datas = [];
    export let title = "Table";
</script>

<Card class="w-100">
    <CardHeader>
        <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardBody>
        <Table hover striped bordered class="text-center">
            <thead>
                <tr>
                    {#each Object.keys(datas[0] || {}) as key}
                        {#if key == "startDateTime"}
                            <th>Start Date</th>
                            <th>Start Time</th>
                        {:else if key == "endDateTime"}
                            <th>End Date</th>
                            <th>End Time</th>
                        {:else}
                            <th>{SnakeCaseToCapitalized(key)}</th>
                        {/if}
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each datas as data}
                    <tr>
                        {#each Object.values(data) as value}
                            {#if isObject(value)}
                                <td class="d-flex justify-content-center gap-2">
                                    {#each Object.keys(value) as key}
                                        {#if isFunction(value[key])}
                                            <Button
                                                class="btn"
                                                on:click={async () => {
                                                    try {
                                                        await value[key]();
                                                        dispatch(
                                                            `${key}Success`,
                                                            data,
                                                        );
                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                }}
                                                >{SnakeCaseToCapitalized(
                                                    key,
                                                )}</Button
                                            >
                                        {:else if !isNumber(value[key])}
                                            <Button
                                                href={value[key]}
                                                class="btn"
                                                >{SnakeCaseToCapitalized(
                                                    key,
                                                )}</Button
                                            >
                                        {/if}
                                    {/each}
                                </td>
                            {:else if isDateTimeValid(value)}
                                <td>{formatDate(new Date(value))}</td>
                                <td>{formatTime(new Date(value))}</td>
                            {:else if !isNumber(value)}
                                <td>{SnakeCaseToCapitalized(value)}</td>
                            {:else}
                                <td>{value}</td>
                            {/if}
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </Table>
    </CardBody>
</Card>
