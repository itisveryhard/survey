<script setup lang="ts">
defineOptions({
  name: 'SurveyItem'
});

defineProps({
  title: { type: String },
  id: { type: String }
});
</script>

<template>
  <router-link :to="{ name: 'SurveyDetails', params: { id } }">
    <div class="h-30 p-4 bg-green-200 rounded-md">
      {{ title }}
    </div>
  </router-link>
</template>

<style scoped>

</style>
