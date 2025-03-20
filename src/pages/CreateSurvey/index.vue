<script setup lang="ts">
import { Button } from "primevue";
import { ref, onMounted } from "vue";
import CreateQuestionCard from "./components/CreateQuestionCard.vue";
import { api } from "../../api";
import { useRoute } from "vue-router";
import type { TAnswerOptions, TConnectionType, TConnections, TQuestion } from "../../api/question/question.types.ts";
import CreateSurveyModal from "../SurveyList/components/CreateSurveyModal.vue";

export type Question = {
  title: string;
  text: string;
  connectionType?: TConnectionType;
  answer_options?: TAnswerOptions[];
  connections?: TConnections[],
  nextQuestion?: string;
  nextQuestionId?: string;
  id: string;
}

defineOptions({
  name: 'CreateSurvey'
});

const isLoading = ref(false);
const title = ref('');
const questions = ref<Question[]>([]);
const savedQuestion = ref<TQuestion[]>([])
const isModalOpen = ref(false);
const route = useRoute();

const updateQuestion = (index: number, updatedQuestion: Question) => {
  questions.value[index] = updatedQuestion;
}

const updateTitle = (value: string) => {
  title.value = value
}

const addQuestion = () => {
  isLoading.value = true;
  api.question.createQuestion({
    text: 'Текст вопроса',
    survey: String(route.params.id)
  }).then(({ data }) => {
    questions.value.push({
      title: `Вопрос ${questions.value.length + 1}`,
      answer_options: [],
      text: 'Текст вопроса',
      id: data.id
    });
  }).finally(() => {
    isLoading.value = false;
  })
}

const getSurvey = () => {
  api.survey.getOne(String(route.params.id)).then(({ data }) => {
    title.value = data.title;
    savedQuestion.value = [...data.questions];
    questions.value = data.questions ? data.questions.sort((a,b) => Number(a.id) - Number(b.id)).map((i, index) => {
      const obj: Question = {
        title: `Вопрос ${index + 1}`,
        id: i.id,
        text: i.text,
        connectionType: i.connections?.length ? i.connections[0].connection_type : undefined,
        answer_options: i.answer_options ? i.answer_options.map((answer) => {
          const answerConnection = i.connections && i.connections.find(connection => connection.answer_option_id === answer.id)
          if (answerConnection && answerConnection.connection_type === 'specific') {
            return {
              id: answer.id,
              text: answer.text,
              connection: answerConnection.to_question,
              connectionId: answerConnection.id,
            };
          }
          return { text: answer.text, id: answer.id };
        }) : [],
        connections: i.connections,
        nextQuestion: i.connections?.[0]?.connection_type === 'any' ? i.connections?.[0]?.to_question : undefined,
        nextQuestionId: i.connections?.[0]?.connection_type === 'any' ? i.connections?.[0]?.id : undefined,
      }
      return obj;
    }) : []
  })
}

onMounted(() => {
  getSurvey();
})
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="flex justify-between">
      <div class="flex items-center">
        <h1 class="text-xl font-semibold">{{ title }}</h1>
        <Button label="Редактировать название" @click="isModalOpen = true" class="ml-4" />
      </div>
      <router-link :to="{ name: 'SurveyDetails', params: { id: route.params.id }}">
        <Button :disabled="!questions.length" label="Просмотр" />
      </router-link>
    </div>
    <div class="flex-1">
      <div v-for="(item, index) in questions" :key="index" class="mt-4">
        <create-question-card
            :title="item.title"
            :question="item"
            :questions="questions"
            @update-question="updateQuestion(index, $event)"
        />
      </div>
    </div>
    <div class="flex justify-center mt-4 pb-4">
      <Button label="Добавить вопрос" class="w-100" :loading="isLoading" @click="addQuestion" />
    </div>
    <create-survey-modal
        v-model:visible="isModalOpen"
        :is-edit="true"
        :initial-value="title"
        :id="route.params.id"
        @update-survey-title="updateTitle"
    />
  </div>
</template>
