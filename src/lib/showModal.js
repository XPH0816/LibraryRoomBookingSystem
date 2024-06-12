import Modal from "$lib/components/Modal.svelte";
export default function showModal(title, msg) {
    const modal = new Modal({
        target: document.body,
        props: {
            show: true,
            title,
            msg,
            close: () => { modal.$destroy() },
        },
    });
}