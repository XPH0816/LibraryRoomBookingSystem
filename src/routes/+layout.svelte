<script>
  import { theme } from "$lib/store";
  import { Styles } from "@sveltestrap/sveltestrap";
  import { beforeNavigate, goto, invalidateAll, onNavigate } from "$app/navigation";
    import { getItem } from "$lib/helper";

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
  beforeNavigate((navigation) => {
    if (
      navigation.to.route.id.includes("(authed)") ||
      navigation.to.route.id.includes("(admin)")
    ) {
      let token = getItem("token");
      if (!token){
        navigation.cancel();
        return invalidateAll();
      } 
    }
  });
</script>

<Styles theme={$theme} />

<slot />
