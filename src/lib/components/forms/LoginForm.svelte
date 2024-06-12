<script>
  import {
    Row,
    Button,
    Input as BInput,
    CardTitle,
    Container,
  } from "@sveltestrap/sveltestrap";
  import Form from "../Form.svelte";
  import Input from "../Input.svelte";

  export let email = "";
  export let password = "";
  export let usertype = "user";
  export let registerLink = "/register";

  let feedback = "Username or password is incorrect";

  export let invalid = false;

  export let login = () => {
    console.log("Logging in");
  };
</script>

<Form submit={login} center>
  <Row class="justify-content-center">
    <img src="/icon.png" alt="PTTA Logo" />
  </Row>
  <CardTitle class="text-secondary">
    Welcome to Library Room Booking System
  </CardTitle>
  <Input
    bind:value={email}
    type="email"
    placeholder="Enter your email"
    {feedback}
    {invalid}
  />
  <Input
    bind:value={password}
    placeholder="Enter your password"
    {feedback}
    {invalid}
    icon="key"
    type="password"
  />
  <div class="d-flex justify-content-around">
    {#each ["user", "admin"] as value}
      <BInput
        class="form-check-inline"
        type="radio"
        bind:group={usertype}
        {value}
        label={value.charAt(0).toUpperCase() + value.slice(1)}
      />
    {/each}
  </div>
  <Button
    class="w-100"
    disabled={email && password ? false : true}
    type="submit">Login</Button
  >
  <Container fluid class="d-flex justify-content-center">
    <a href={registerLink}>Don't have an account? Register here</a>
  </Container>
</Form>

<style>
  img {
    width: 150px;
  }
</style>
