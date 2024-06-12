<script>
    export let icon;
    export let click = () => {};
    /** @type {"button"|"submit"|"reset"} */
    export let type = "button";
</script>

<button class={icon} on:click={click} {type}></button>

<style>
    button {
        border: var(--bs-btn-border-width) solid var(--bs-btn-border-color);
        background-color: var(--bs-btn-bg);
        border-radius: var(--bs-btn-border-radius);
    }
</style>
