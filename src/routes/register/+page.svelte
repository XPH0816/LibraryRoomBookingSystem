<script>
    import { goto } from "$app/navigation";
    import { register } from "$lib/auth";
    import RegisterForm from "$lib/components/forms/RegisterForm.svelte";
    import { logUserActivity } from "$lib/helper";
    import showModal from "$lib/showModal";

    let email = "";
    let password = "";
    let phone = "";
    /** @type {"student"|"staff"|"visitor"} */
    let usertype = "student";

    let registerFunc = async () => {
        try {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const phoneRegex = /^010-[0-9]{8}$|^01[1-9]-[0-9]{7}$/;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!emailRegex.test(email)) throw new Error("Invalid email address.");
            if (!phoneRegex.test(phone)) throw new Error("Invalid phone number format (010-xxxxxxxx) or (01x-xxxxxxx).");
            if (!passwordRegex.test(password)) throw new Error("Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character.");
            await register(email, password, phone, usertype);
            logUserActivity(`Registered as ${email}`, email);
            goto("/");
        } catch (err) {
            if (!err.message) showModal("Error", "An error occurred. Please try again later.");
            else showModal("Failed", err.message);
        }
    };
</script>

<main class="container-fluid">
    <RegisterForm
        bind:email
        bind:password
        bind:phone
        bind:usertype
        register={registerFunc}
    />
</main>

<style>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
</style>
