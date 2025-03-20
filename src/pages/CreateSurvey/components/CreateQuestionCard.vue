<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Button, InputText, Dropdown } from "primevue";
import type { TAnswerOptions, TConnectionType } from "../../../api/question/question.types.ts";
import type { Question } from "../index.vue";
import type { PropType } from 'vue';
import { api } from "../../../api";
import { useRoute } from "vue-router";

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
  questions: { type: Array },
  question: { type: Object as PropType<Question> }
});

const emit = defineEmits(['update-question']);
const route = useRoute();

const form = ref<Form>({
  question: '',
  options: [],
  connectionType: null,
  nextQuestion: ''
});

const isLoading = ref(false);

const connectionOptions = [
  { label: 'Любой ответ вопроса -> любой другой', value: 'any' },
  { label: 'Конкретный ответ вопроса -> любой другой', value: 'specific' }
];

const addOption = () => {
  isLoading.value = true;
  const text = `Вариант ${form.value.options.length + 1}`;
  api.question.addAnswerToQuestion({ text, question: props.question.id }).then(({ data }) => {
    form.value.options.push({ text, id: data.id });
  }).finally(() => {
    isLoading.value = false;
  })
};

let timeout = null;

const handleQuestionInput = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if(!!form.value.question) {
      api.question.updateQuestion({ text: form.value.question, survey: route.params.id }, props.question.id)
    }
  }, 500);
};

let answerTimer = null;

const handleAnswerInput = (value, id) => {
  clearTimeout(answerTimer);
  answerTimer = setTimeout(() => {
    if(!!value) {
      api.question.updateAnswerQuestion(
          { text: value, question: props.question.id },
          id
      )
    }
  }, 500);
}

const changeConnectionType = async () => {
  if(props.question?.connections?.length) {
    await api.question.deleteAllConnections(props.question?.id)
  }
  const clearedOptions = form.value.options.map(i => ({ text: i.text, id: i.id }))
  form.value.nextQuestion = undefined;
  form.value.options = clearedOptions;
  emit(
      'update-question',
      {
        id: props.question?.id,
        title: props.title,
        text: form.value.question,
        connectionType: null,
        nextQuestion: undefined,
        nextQuestionId: undefined,
        answer_options: clearedOptions
      }
  );
}

const setSpecificConnection = ({ value }, item) => {
  const isExistedConnection = props.question.connections && props.question.connections.find(i => i.id === item.connection)
  if(isExistedConnection) {
    api.question.updateConnection({
      connection_type: 'specific',
      answer_option: String(item.id),
      to_question: value,
      from_question: props.question.id
    }, props.question.nextQuestionId)
  } else {
    api.question.addConnection({
      connection_type: 'specific',
      from_question: props.question.id,
      answer_option: String(item.id),
      to_question: value
    })
  }
}

const setAnyConnection = ({ value }) => {
  if(props.question.connectionType) {
    api.question.updateConnection({
      connection_type: 'any',
      answer_option: null,
      to_question: value,
      from_question: props.question.id
    }, props.question.nextQuestionId)
  } else {
    api.question.addConnection({
      connection_type: 'any',
      from_question: props.question.id,
      answer_option: null,
      to_question: value
    })
  }
}


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
                :options="questions.filter(i => i.id !== question.id)"
                @change="setAnyConnection"
                optionLabel="title"
                optionValue="id"
                class="w-full"
                placeholder="Выберите связь"
            />
          </div>
          <div class="flex flex-col mt-4 gap-2 w-100">
            <label for="question" class="font-semibold">Вопрос</label>
            <InputText id="question" v-model="form.question" @input="handleQuestionInput" class="w-full" />
          </div>
          <div class="flex flex-col mt-4 gap-2">
            <label class="font-semibold">Варианты ответа</label>
            <div v-for="(item, index) in form.options" :key="index" class="flex items-center">
              <div class="flex">
                <div class="flex justify-between items-center w-100">
                  <div class="whitespace-nowrap mr-4">Вариант {{ index + 1 }}</div>
                  <InputText
                      v-model="form.options[index].text"
                      @input="(e) => handleAnswerInput(e.target.value, item.id)"
                      class="w-full"
                  />
                </div>
                <div v-if="form.connectionType === 'specific'" class="ml-4 w-100">
                  <Dropdown
                      id="connection"
                      v-model="form.options[index].connection"
                      :options="questions.filter(i => i.id !== question.id)"
                      @change="(val) => setSpecificConnection(val, item)"
                      optionLabel="title"
                      optionValue="id"
                      class="w-full"
                      placeholder="Выберите связь"
                  />
                </div>
              </div>
            </div>
          </div>
          <Button
              label="Добавить вариант"
              class="mt-4 w-100"
              :loading="isLoading"
              @click.prevent="addOption"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="connection" class="font-semibold">Тип подключения</label>
          <Dropdown
              id="connection"
              v-model="form.connectionType"
              :options="connectionOptions"
              @change="changeConnectionType"
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
