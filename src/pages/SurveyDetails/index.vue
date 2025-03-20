<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { TSurvey } from "../../api/survey/survey.types.ts";
import { api } from "../../api";
import { useRoute } from "vue-router";
import QuestionCard from "./components/QuestionCard.vue";
import { Button } from "primevue";
import type { TQuestion } from "../../api/question/question.types.ts";

defineOptions({
  name: 'SurveyDetails'
});

const route = useRoute();
const survey = ref<TSurvey>()
const questions = ref<TQuestion[]>([])
const currentQuestion = ref(0)
const nextQuestionIndex = ref<number | null>(null)

const selectAnswer = (value: string) => {
  nextQuestionIndex.value = questions.value.findIndex(i => i.id === value);
}

const nextStep = () => {
  if(currentQuestion.value !== questions.value?.length - 1 && nextQuestionIndex.value) {
    currentQuestion.value = nextQuestionIndex.value
    nextQuestionIndex.value = null;
  }
}

onMounted(() => {
  const { id } = route.params;
  if(id) {
    api.survey.getOne(String(id)).then(({ data }) => {
      survey.value = data;
      questions.value = data.questions.sort((a,b) => Number(a.id) - Number(b.id));
    })
  }
})
</script>

<template>
  <div class="p-4 border rounded-lg shadow-md h-fit w-full">
    <h1 class="mb-4">Вопрос {{currentQuestion + 1}}</h1>
    <QuestionCard :question="questions[currentQuestion]" @select-answer="selectAnswer"/>
    <Button class="mt-4" label="Далее" :disabled="!nextQuestionIndex" @click="nextStep" />
  </div>
</template>
