<!-- src/App.vue -->
<template>
  <component :is="$isMobile ? 'AppMobile' : 'AppDesktop'" />
</template>

<script>
import AppDesktop from './AppDesktop.vue';
import AppMobile from './AppMobile.vue';

export default {
  name: 'App',
  components: { AppDesktop, AppMobile }
}
</script>

