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
const demo=[
  {id:1,avatar:'https://placehold.co/40',author:'Alice',time:'刚刚',content:'<p>Hello</p>',imgs:[],views:0,cmts:[]}
]
</script>
