<script>
    import ProfileForm from "$lib/components/forms/ProfileForm.svelte";
    import ChangePassword from "$lib/components/forms/ChangePassword.svelte";
    import { user } from "$lib/store.js";
    import { updateUserById } from "$lib/models/user.js";
    import { updatePassword, verifyOldPassword } from "$lib/auth";
    import showModal from "$lib/showModal";
    import { logUserActivity } from "$lib/helper";

    let currentPassword = "";
    let password = "";

    let username = $user.username;
    let email = $user.email;
    let phone = $user.phone;
    /** @type {"admin" | "user"} */
    let usertype = $user.usertype == "admin" ? "admin" : "user";
    
    let invalid = false;
    let changeSuccess = false;
    let updateSuccess = false;

    let update = async () => {
        updateSuccess = false;
        try {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const phoneRegex = /^010-[0-9]{8}$|^01[1-9]-[0-9]{7}$/;
            if (!emailRegex.test(email)) throw new Error("Invalid email address.");
            if (!phoneRegex.test(phone)) throw new Error("Invalid phone number format (010-xxxxxxxx) or (01x-xxxxxxx).");
            await updateUserById(username, email, phone, usertype, $user.id);
            $user.username = username;
            $user.email = email;
            $user.phone = phone;
            updateSuccess = true;
            logUserActivity(`Updated profile`, $user.email);
        } catch (error) {
            console.error(error);
            if (!error.message) showModal("Error", "An error occurred. Please try again later.");
            else showModal("Failed", error.message);
        }
    };

    let changePassword = async () => {
        invalid = changeSuccess = false;
        try {
            if (!(await verifyOldPassword(currentPassword, usertype, $user.id)))
                throw new Error("Invalid password");

            await updatePassword(password, usertype, $user.id);
            changeSuccess = true;
            logUserActivity(`Changed password`, $user.email);
        } catch (error) {
            if (error.message && error.message === "Invalid password")
                invalid = true;
            else console.error(error);
        }
    };
</script>

<main class="container-fluid d-flex flex-column gap-3">
    <ProfileForm
        bind:visible={updateSuccess}
        bind:username
        bind:email
        bind:phone
        {usertype}
        {update}
    />
    <ChangePassword
        bind:currentPassword
        bind:invalid
        bind:password
        update={changePassword}
        bind:visible={changeSuccess}
    />
</main>
