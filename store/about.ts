import {defineStore} from "pinia";
import {IParagraph} from "~/assets/interfaces/interface";
import {calculateAge} from "~/assets/js/utils";

export const useAboutStore = defineStore('about', () => {
    {
        const age = calculateAge('14.08.1996');

        const state: IParagraph[] = [
            {
                value: `Hello, my name is Adilkhan and I am ${age} years old. I'm a frontend developer. 
                        I graduated from the Frontend Development faculty at <a href='https://gb.ru/'>Geekbrains</a>, 
                        where I also served as a mentor during the training.
                        `,
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

        return {
            state
        }
    }
})
