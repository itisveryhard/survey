import { createRouter, createWebHistory } from 'vue-router'
import EditSurvey from '../pages/EditSurvey/index.vue'
import SurveyList from '../pages/SurveyList/index.vue'


const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        { path: '/', name: 'SurveyList', component: SurveyList },
        { path: '/survey/:id', name: 'EditSurvey', component: EditSurvey },
    ]
});

export default router;
