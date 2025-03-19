<script setup lang="ts">
import { Button } from "primevue";
import { ref, onMounted } from "vue";
import CreateQuestionCard from "./components/CreateQuestionCard.vue";
import { api } from "../../api";
import { useRoute } from "vue-router";
import type { TAnswerOptions, TConnectionType, TQuestion } from "../../api/question/question.types.ts";

export type Question = {
  title: string;
  text: string;
  connectionType?: TConnectionType;
  answer_options?: TAnswerOptions[];
  nextQuestion?: string;
  id?: string;
}

defineOptions({
  name: 'CreateSurvey'
});

const isLoading = ref(false);
const title = ref('');
const questions = ref<Question[]>([]);
const savedQuestion = ref<TQuestion[]>([])
const route = useRoute();

const updateQuestion = (index: number, updatedQuestion: Question) => {
  questions.value[index] = updatedQuestion;
}

const addQuestion = () => {
  questions.value.push({ title: `Вопрос ${questions.value.length + 1}`, answer_options: [], text: '' });
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
        answer_options: i.answer_options ? i.answer_options.map((answer, index) => {
          if (i.connections?.length) {
            const questionIndex = data.questions.findIndex(item =>
                item.id === i.connections?.[index]?.to_question
            );
            return {
              text: answer.text,
              connection: questionIndex === -1 ? undefined : `Вопрос ${questionIndex + 1}`
            };
          }
          return { text: answer.text };
        }) : []
      }
      if (obj.connectionType === 'any' && i.connections?.length) {
        const questionIndex = data.questions.findIndex(item =>
            item.id === i.connections?.[0]?.to_question
        );
        if (questionIndex !== -1) {
          obj.nextQuestion = `Вопрос ${questionIndex + 1}`;
        }
      }
      return obj;
    }) : []
  })
}

const createNewQuestion = (newQuestions: Question[]) => {
  const promises = newQuestions.map(i => {
    if(i.text) {
      return api.question.createQuestion({
        text: i.text,
        survey: String(route.params.id)
      })
    }
  })
  Promise.allSettled(promises).then((res) => {
    res.forEach((i, index) => {
      if (i.status === "fulfilled") {
        const fulfilledResult = i as PromiseFulfilledResult<{ data: { id: string } }>;
        const newQuestionItem = newQuestions[index];
        const questionIndex = questions.value.findIndex(i => i.title === newQuestionItem.title);
        questions.value[questionIndex] = { ...questions.value[questionIndex], id: fulfilledResult.value.data?.id }
        const answerOptions = newQuestionItem?.answer_options;
        if (answerOptions && fulfilledResult.value.data?.id) {
          const answerPromises = answerOptions.map(answer =>
              api.question.addAnswerToQuestion({
                text: answer.text,
                question: fulfilledResult.value.data.id
              })
          );
          Promise.allSettled(answerPromises).then((response) => {
            response.forEach((item, answersIndex) => {
              if(item.status === 'fulfilled') {
                const answerOptionItem = answerOptions[answersIndex];
                const isSpecificConnection = newQuestionItem.connectionType === 'specific';
                if(isSpecificConnection) {
                  const connectionId = questions.value.find(i => i.title === answerOptionItem.connection)?.id
                  if(connectionId) {
                    api.question.addConnection({
                      connection_type: "specific",
                      from_question: fulfilledResult.value.data.id,
                      answer_option: item.value.data.id,
                      to_question: connectionId
                    })
                  }
                } else {
                  const connectionId = questions.value.find(i => i.title === newQuestionItem.nextQuestion)?.id
                  if(connectionId) {
                    api.question.addConnection({
                      connection_type: "any",
                      from_question: fulfilledResult.value.data.id,
                      answer_option: null,
                      to_question: connectionId
                    })
                  }
                }
              }
            })
          });
        }
      }
    });
  })
}

const editOldQuestions = (oldQuestions: Question[]) => {
  const promises = oldQuestions.map(i => {
    const prevItem = savedQuestion.value.find(question => question.id === i.id)
    if(prevItem && i.text && prevItem.text !== i.text && i.id) {
      return api.question.updateQuestion({
        text: i.text,
        survey: String(route.params.id)
      }, i.id)
    }
  })
  Promise.allSettled(promises);
}

const onSave = () => {
  const newQuestions = questions.value.filter(i => !i.id);
  const oldQuestions = questions.value.filter(i => i.id);
  try {
    isLoading.value = true;
    if(newQuestions.length) {
      isLoading.value = true;
      createNewQuestion(newQuestions)
    }
    if(oldQuestions.length) {
      editOldQuestions(oldQuestions)
    }
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getSurvey();
})
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="flex justify-between">
      <h1 class="text-xl font-semibold">{{ title }}</h1>
      <Button label="Сохранить" :loading="isLoading" @click="onSave" />
    </div>
    <div class="flex-1">
      <div v-for="(item, index) in questions" :key="index" class="mt-4">
        <create-question-card
            :title="item.title"
            :question="item"
            :available-questions="questions"
            @update-question="updateQuestion(index, $event)"
        />
      </div>
    </div>
    <div class="flex justify-center mt-4">
      <Button label="Добавить вопрос" class="w-100" @click="addQuestion" />
    </div>
  </div>
</template>
