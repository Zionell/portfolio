import {defineStore} from "pinia";
import {IExperience} from "~/assets/interfaces/interface";

export const useExperienceStore = defineStore('experience', {
    state: (): IExperience[] => {
        return [
            {
                company: "IdaProject",
                position: "middle frontend-developer",
                period: "january 2022 — currently",
                tasks: "Frontend development with Vue, refactoring, development of personal accounts",
                achievements: "Gained experience in developing an application from scratch, team development, development of large projects, personal accounts, interaction with a team of designers, backend developers",
                stack: "Nuxt, Vue, Figma"
            },
            {
                company: "Sarawan",
                position: "frontend-developer",
                period: "august 2021 — march 2022",
                tasks: "Development of the service's frontend part, code review, assisting colleagues in solving problems, developing problem-solving technologies for all stages of work on the service, participation in discussions of the project architecture",
                achievements: "Gained experience in developing an application from scratch. During my tenure, I was appointed the leader of frontend development, developed and successfully implemented a UI library, and enhanced the competency of the frontend developer in terms of interaction with backend developers",
                stack: "HTML, SASS, JS, GULP, React, Redux, Redux-Thunk, Figma, React-yandex-maps, React-transition-group"
            },
            {
                company: "GeekBrains",
                position: "mentor",
                period: "december 2020 — december 2021",
                tasks: "Carrying out project tasks, creating SPA applications, enhancing knowledge level, mentoring",
                achievements: "Successfully completed and mastered the course program, acquired the skill of code review, achieved the status of a mentor",
                stack: "HTML, CSS, SASS, JS, Webpack, Vue, Vuex, React, Redux, Redux-Thunk, Node.js"
            },
        ]
    },
})
