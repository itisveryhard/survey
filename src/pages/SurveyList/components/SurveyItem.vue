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
  <router-link :to="{ name: 'EditSurvey', params: { id } }">
    <div class="h-30 flex justify-center items-center font-semibold text-xl bg-green-200 rounded-md">
      {{ title }}
    </div>
  </router-link>
</template>
