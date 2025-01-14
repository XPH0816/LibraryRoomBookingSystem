<script>
  import LoginForm from "$lib/components/forms/LoginForm.svelte";
  import { login } from "$lib/auth";
    import { logUserActivity } from "$lib/helper";

  let email = "";
  let password = "";
  let usertype = "user";
  let registerLink = "/register";
  let invalid = false;

  let loginFunc = async () => {
    try {
      invalid = false;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) throw new Error("Invalid email address.");
      logUserActivity(`Logged in as ${email}`, email);
      await login(email, password, usertype, "/home");
    } catch (err) {
      invalid = true;
    }
  };
</script>

<main class="container-fluid">
  <LoginForm
    bind:email
    bind:password
    bind:usertype
    bind:invalid
    {registerLink}
    login={loginFunc}
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
