import { get, readable, writable } from "svelte/store";

/** @type {import("svelte/store").Writable<"auto"|"light"|"dark">} */
export const theme = writable("auto");

export const user = writable(null);

export const currentDateTime = readable(new Date(), function start(set) {
    const interval = setInterval(() => {
        set(new Date());
    }, 1000 * 2);

    return () => clearInterval(interval);
});

const roomType = readable([
    { name: 'iqra_room', price: 20, duration: { month: 1 } },
    { name: 'hikmah_room', price: 0, duration: { hour: 2 } },
    { name: 'eksplorasi_room', price: 0, duration: { hour: 2 } },
    { name: 'big_stage', price: 0, duration: { day: 0 } },
    { name: 'lestari_room', price: 0, duration: { day: 0 } },
    { name: 'auditorium', price: 0, duration: { day: 0 } },
    { name: 'lestari_lounge', price: 0, duration: { day: 0 } },
]);

export function getRoomType() {
    return get(roomType);
}

export function getCurrentDateTime() {
    return get(currentDateTime);
}