<script setup lang="ts">
import {type PropType, ref, watch} from "vue";
import { RadioButton } from "primevue";
import type { TQuestion } from "../../../api/question/question.types.ts";

defineOptions({
  name: 'QuestionCard'
});

const props = defineProps({
  question: { type: Object as PropType<TQuestion> }
})

const emit = defineEmits(['select-answer']);

const model = ref();

watch(model, () => {
  if(props.question?.connections && props.question?.connections[0].connection_type === 'any') {
    emit('select-answer', props.question?.connections[0].to_question)
  } else {
    const nextQuestion = props.question?.connections && props.question?.connections.find(i => i.answer_option_id === model.value.id)
    if(nextQuestion) {
      emit('select-answer', nextQuestion?.to_question)
    }
  }
})
</script>

<template>
  <div>
    <div v-if="question">
      <div class="mb-4">{{ question.text }}</div>
      <div class="flex-col">
        <div v-for="(item, index) in question.answer_options" class="flex items-center gap-2">
          <RadioButton v-model="model" :inputId="String(index)" :value="item" />
          <label :for="String(index)">{{ item.text }}</label>
        </div>
      </div>
    </div>
  </div>
</template>
