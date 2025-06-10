<template>
  <MomentsList
    :posts="demo"
    :hasMore="false"
    @open-modal="()=>{}"
    @toggle-comments="()=>{}"
    @load-more="()=>{}"
  />
</template>

<script setup>
import MomentsList from '@/components/molecules/MomentsList.vue';

</script>
