<script setup lang="ts">
import { Button } from "primevue";
import {onMounted, ref} from "vue";
import SurveyItem from "./components/SurveyItem.vue";
import { api } from "../../api";
import CreateSurveyModal from "./components/CreateSurveyModal.vue";
import type { TSurvey } from "../../api/survey/survey.types.ts";

defineOptions({
  name: 'SurveyList'
});

const surveys = ref<TSurvey[]>([]);
const isModalOpen = ref(false);

const getSurveys = () => {
  api.survey.getList().then(({ data }) => {
    surveys.value = data;
  })
}

onMounted(() => {
  getSurveys();
})

</script>

<template>
  <div class="w-full flex flex-col flex-1 justify-between">
    <div class="mt-4">
      <div class="font-semibold text-xl">История опросов</div>
      <div class="mt-4 gap-4 flex flex-wrap">
        <SurveyItem v-for="item in surveys" :key="item.id" :title="item.title" :id="item.id" />
      </div>
    </div>
    <div class="flex justify-center">
      <Button label="Создать опрос" @click="isModalOpen = true" class="w-100" />
    </div>
    <create-survey-modal v-model:visible="isModalOpen" />
  </div>
</template>

<style scoped>

</style>
