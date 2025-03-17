<script setup lang="ts">
import { Button } from "primevue";
import { ref } from "vue";
import SurveyItem from "./components/SurveyItem.vue";
defineOptions({
  name: 'SurveyList'
});

const surveys = ref([
    {id: '1', title: 'opros'},
    {id: '2', title: 'kto vy'},
    {id: '3', title: 'kto my'},
    {id: '4', title: 'kto oni'}
]);
</script>

<template>
  <div class="w-full mt-10">
    <div class="flex justify-center">
      <router-link :to="{ name: 'CreateSurvey'}">
        <Button label="Создать опрос" class="w-100" />
      </router-link>
    </div>
    <div class="mt-4">
      <div>История опросов</div>
      <div class="mt-4 grid grid-cols-3 gap-4">
        <div v-for="item in surveys" :key="item.id">
          <SurveyItem :title="item.title" :id="item.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
