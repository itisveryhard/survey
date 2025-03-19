<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Button, InputText, Dropdown } from "primevue";
import type { TAnswerOptions, TConnectionType } from "../../../api/question/question.types.ts";
import type { Question } from "../index.vue";
import type { PropType } from 'vue';

interface Form {
  question: string;
  options: TAnswerOptions[];
  connectionType: TConnectionType | null;
  nextQuestion: string;
}

defineOptions({
  name: 'CreateQuestionCard'
});

const props = defineProps({
  title: { type: String },
  availableQuestions: { type: Array },
  question: { type: Object as PropType<Question> }
});

const emit = defineEmits(['update-question']);

const form = ref<Form>({
  question: '',
  options: [],
  connectionType: null,
  nextQuestion: ''
});

const connectionOptions = [
  { label: 'Любой ответ вопроса -> любой другой', value: 'any' },
  { label: 'Конкретный ответ вопроса -> любой другой', value: 'specific' }
];

const addOption = () => {
  form.value.options.push({ text: '' });
};

const isOptionsValid = computed(() => {
  return form.value.options.every(option => option.text.trim() !== '');
});

const emitUpdatedQuestion = () =>  {
  emit(
      'update-question',
      {
        id: props.question?.id,
        title: props.title,
        text: form.value.question,
        connectionType: form.value.connectionType,
        nextQuestion: form.value.nextQuestion,
        answer_options: form.value.options
      }
  );
}

watch(
    () => form.value.question,
    () => {
      emitUpdatedQuestion();
    }
);

watch(
    () => form.value.nextQuestion,
    () => {
      emitUpdatedQuestion();
    }
);

watch(
    () => form.value.options,
    () => {
      emitUpdatedQuestion();
    },
    { deep: true }
);

onMounted(() => {
  if(props.question) {
    form.value.question = props.question.text;
    if(props.question.answer_options) {
      form.value.options = [...props.question.answer_options]
    }
    if(props.question.connectionType) {
      form.value.connectionType = props.question.connectionType;
    }
    if(props.question.nextQuestion) {
      form.value.nextQuestion = props.question.nextQuestion;
    }
  }
})
</script>

<template>
  <div class="p-4 border rounded-lg shadow-md">
    <form class="space-y-4">
      <div class="flex justify-between">
        <div>
          <div class="text-xl font-semibold">{{ title }}</div>
          <div v-if="form.connectionType === 'any'" class="mt-4 w-100">
            <label for="connection" class="font-semibold">-></label>
            <Dropdown
                id="connection"
                v-model="form.nextQuestion"
                :options="availableQuestions"
                optionLabel="title"
                optionValue="title"
                class="w-full"
                placeholder="Выберите связь"
            />
          </div>
          <div class="flex flex-col mt-4 gap-2 w-100">
            <label for="question" class="font-semibold">Вопрос</label>
            <InputText id="question" v-model="form.question" class="w-full" />
          </div>
          <div class="flex flex-col mt-4 gap-2">
            <label class="font-semibold">Варианты ответа</label>
            <div v-for="(_, index) in form.options" :key="index" class="flex items-center">
              <div class="flex">
                <div class="flex justify-between items-center w-100">
                  <div class="whitespace-nowrap mr-4">Вариант {{ index + 1 }}</div>
                  <InputText v-model="form.options[index].text" :disabled="!!props.question?.id" class="w-full" />
                </div>
                <div v-if="form.connectionType === 'specific'" class="ml-4 w-100">
                  <Dropdown
                      id="connection"
                      v-model="form.options[index].connection"
                      :options="availableQuestions"
                      :disabled="!!props.question?.id"
                      optionLabel="title"
                      optionValue="title"
                      class="w-full"
                      placeholder="Выберите связь"
                  />
                </div>
              </div>
            </div>
          </div>
          <Button label="Добавить вариант" class="mt-4 w-100" @click.prevent="addOption" :disabled="!isOptionsValid" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="connection" class="font-semibold">Тип подключения</label>
          <Dropdown
              id="connection"
              v-model="form.connectionType"
              :options="connectionOptions"
              :disabled="!!props.question?.id"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              placeholder="Выберите тип"
          />
        </div>
      </div>
    </form>
  </div>
</template>
