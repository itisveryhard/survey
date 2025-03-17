<script setup lang="ts">
import { Button } from "primevue";
import { ref, computed } from "vue";
import CreateSurveyCard from "./components/CreateSurveyCard.vue";

interface Question {
  title: string;
}

defineOptions({
  name: 'CreateSurvey'
});

const questions = ref<Question[]>([]);

const addQuestion = () => {
  questions.value.push({ title: `Вопрос ${questions.value.length + 1}` });
}

const getNextQuestions = (index: number) => {
  return computed(() => questions.value.slice(index + 1));
};
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="flex justify-between">
      <h1 class="text-xl font-semibold">Название опроса</h1>
      <Button label="Сохранить" />
    </div>
    <div class="flex-1">
      <div v-for="(item, index) in questions" :key="index" class="mt-4">
        <CreateSurveyCard :title="item.title" :available-questions="getNextQuestions(index).value" />
      </div>
    </div>
    <div class="flex justify-center mt-4">
      <Button label="Добавить вопрос" class="w-100" @click="addQuestion" />
    </div>
  </div>
</template>
