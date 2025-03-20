<script setup lang="ts">
import { defineModel, ref, toRef, watch } from "vue";
import { useRouter } from "vue-router";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { api } from "../../../api";

defineOptions({
  name: 'CreateSurveyModal'
});

const props = defineProps({
  isEdit: Boolean,
  initialValue: String,
  id: String
})

const visible = defineModel("visible", { type: Boolean });
const emit = defineEmits(['update-survey-title']);

const isLoading = ref(false);
const inputValue = ref<string>('');
const initialValueRef = toRef(props, "initialValue");
const router = useRouter();

const createSurvey = () => {
  if(inputValue.value) {
    isLoading.value = true;
    if(props.isEdit) {
      api.survey.updateSurvey({ title: inputValue.value }, String(props.id)).then(() => {
        emit('update-survey-title', inputValue.value)
      }).finally(() => {
        isLoading.value = false;
        visible.value = false;
      })
    } else {
      api.survey.createSurvey({ title: inputValue.value }).then(({ data }) => {
        router.push({ name: "CreateSurvey", params: { id: data.id } });
      }).finally(() => {
        isLoading.value = false;
      })
    }
  }
}


watch(initialValueRef, (newValue) => {
  console.log(initialValueRef)
  if (newValue) {
    inputValue.value = newValue;
  }
});
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Введите данные" :style="{ width: '30rem' }">
    <div>
      <label for="inputData" class="block text-sm font-medium text-gray-700 mb-1">Введите значение:</label>
      <InputText
          id="inputData"
          v-model="inputValue"
          :disabled="isLoading"
          class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <template #footer>
      <Button
          label="Отмена"
          :disabled="isLoading"
          severity="secondary"
          @click="visible = false"
          class="mr-2"
      />
      <Button
          label="Сохранить"
          :disabled="!inputValue"
          :loading="isLoading"
          severity="primary"
          @click="createSurvey"
      />
    </template>
  </Dialog>
</template>
