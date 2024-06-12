<script>
    import { theme } from "$lib/store.js";
    import Cookies from "js-cookie";
    import {
        Nav,
        Navbar,
        NavbarBrand,
        NavbarToggler,
        Collapse,
        Dropdown,
        DropdownToggle,
        DropdownMenu,
        DropdownItem,
        Icon,
        NavItem,
        NavLink,
    } from "@sveltestrap/sveltestrap";
    import { user } from "$lib/store.js";
    import { goto } from "$app/navigation";

    let isOpen = false;
    export let size = "md";

    function logout() {
        Cookies.remove("token");
        goto("/");
    }

    function handleUpdate(event) {
        isOpen = event.detail.isOpen;
    }

    const nav =
        $user.usertype == "admin"
            ? [
                  {
                      name: "Manage Room",
                      href: "/manage/room",
                      icon: "door-closed",
                  },
                  { name: "User List", href: "/manage/user", icon: "people" },
                  {
                      name: "Manage Feedback",
                      href: "/manage/feedback",
                      icon: "info-circle",
                  },
              ]
            : [
                  {
                      name: "Booking Room",
                      href: "/booking",
                      icon: "calendar-plus",
                  },
                  { name: "History", href: "/history", icon: "clock-history" },
                  { name: "Feedback", href: "/feedback", icon: "info-circle" },
              ];
</script>

<Navbar
    container="fluid"
    expand={size}
    theme={$theme}
    class="border border-top-0 border-end-0 border-start-0 border-bottom-5"
>
    <NavbarBrand href="/home">
        <img src="/icon.png" alt="PTTA Logo" width="50" />
    </NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand={size} on:update={handleUpdate}>
        <Nav class="ms-auto" navbar>
            {#each nav as item}
                <NavItem>
                    <NavLink href={item.href}>
                        <Icon name={item.icon} />
                        {item.name}
                    </NavLink>
                </NavItem>
            {/each}
            <div class="topbar-divider d-none d-sm-block"></div>
            <Dropdown nav inNavbar>
                <DropdownToggle nav caret>
                    <span class="d-md-inline">
                        {$user.username}
                    </span>
                </DropdownToggle>
                <DropdownMenu end>
                    <DropdownItem href="/profile">
                        <Icon name="person" />
                        Profile
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem on:click={logout}>
                        <Icon name="box-arrow-right" />
                        Logout
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </Nav>
    </Collapse>
</Navbar>

<slot />

<style>
    .topbar-divider {
        width: 0;
        border-right: 1px solid var(--bs-navbar-color);
        height: calc(4.375rem - 2rem);
        margin: auto 1rem;
    }
</style>
