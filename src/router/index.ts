import { createRouter, createWebHistory } from 'vue-router'
import CreateSurvey from '../pages/CreateSurvey/index.vue'
import SurveyList from '../pages/SurveyList/index.vue'
import SurveyDetails from "../pages/SurveyDetails/index.vue";


const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        { path: '/', name: 'SurveyList', component: SurveyList },
        { path: '/create/:id', name: 'CreateSurvey', component: CreateSurvey },
        { path: '/survey/:id', name: 'SurveyDetails', component: SurveyDetails },
    ]
});

export default router;
