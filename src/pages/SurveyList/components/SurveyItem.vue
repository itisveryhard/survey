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
  <router-link :to="{ name: 'CreateSurvey', params: { id } }">
    <div class="h-30 w-[300px] flex justify-center items-center border hover:shadow-[0_0_10px_rgba(0,0,0,0.5)] shadow-md font-semibold text-xl rounded-md">
      {{ title }}
    </div>
  </router-link>
</template>
