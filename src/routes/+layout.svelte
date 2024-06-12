<script>
  import { theme } from "$lib/store";
  import { Styles } from "@sveltestrap/sveltestrap";
  import { onNavigate } from "$app/navigation";

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<Styles theme={$theme} />

<slot />
