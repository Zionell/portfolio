import {defineStore} from "pinia";
import {IParagraph} from "~/assets/interfaces/interface";

export const useAboutStore = defineStore('about', {
    state: (): IParagraph[] => {
        return [
            {
                value: "Hello, my name is Adilkhan and I am 27 years old. I'm a frontend developer. " +
                    "I graduated from the Frontend Development faculty at <a href='https://gb.ru/'>Geekbrains</a>, " +
                    "where I also served as a mentor during the training.",
            },
            {
                value: "My professional journey began with an internship at a young startup called Sarafan. " +
                    "There, I gained experience in team development and even had the opportunity " +
                    "to lead the frontend development department.",
            },
            {
                value: "Since January 2022, I've been working as a frontend developer at <a href='https://idaproject.com/'>IdaProject</a>."
            },
            {
                value: "In my free time, I explore new technologies and the latest trends in the IT world. " +
                    "I am eager to contribute to creative projects within your team."
            },
        ]
    },
})
