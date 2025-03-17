<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button, InputText, Dropdown } from "primevue";

defineOptions({
  name: 'CreateSurveyCard'
});

defineProps({
  title: { type: String },
  availableQuestions: { type: Array }
});

const form = ref({
  question: '',
  options: [{ title: '' }],
  connection: null,
  nextQuestion: ''
});

const connectionOptions = [
  { label: 'Любой ответ вопроса -> любой другой', value: 'any' },
  { label: 'Конкретный ответ вопроса -> любой другой', value: 'specific' }
];

const addOption = () => {
  form.value.options.push({ title: '' });
};

const isOptionsValid = computed(() => {
  return form.value.options.every(option => option.title.trim() !== '');
});
</script>

<template>
  <div class="p-4 border rounded-lg shadow-md">
    <form class="space-y-4">
      <div class="flex justify-between">
        <div>
          <div class="text-xl font-semibold">{{ title }}</div>
          <div v-if="form.connection === 'any'" class="mt-4 w-100">
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
            <div v-for="(option, index) in form.options" :key="index" class="flex items-center">
              <div class="flex">
                <div class="flex justify-between items-center w-100">
                  <div class="whitespace-nowrap mr-4">Вариант {{ index + 1 }}</div>
                  <InputText v-model="form.options[index].title" class="w-full" />
                </div>
                <div v-if="form.connection === 'specific'" class="ml-4 w-100">
                  <Dropdown
                      id="connection"
                      v-model="form.options[index].connection"
                      :options="availableQuestions"
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
          <Dropdown id="connection" v-model="form.connection" :options="connectionOptions" optionLabel="label" optionValue="value" class="w-full" placeholder="Выберите тип" />
        </div>
      </div>
    </form>
  </div>
</template>
