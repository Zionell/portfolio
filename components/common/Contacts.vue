<script
    setup
    lang="ts"
>
import {onMounted, ref} from 'vue'
import {gsap} from "gsap";
import type {HtmlType} from "~/assets/types";
import {useContactsStore} from "~/store/contacts";
import {TextPlugin} from 'gsap/TextPlugin';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger);

const {$state} = useContactsStore()
const sectionRef = ref<HtmlType>(null);
const socialLineRef = ref<HtmlType[]>([])
const socialItemRef = ref<HtmlType[]>([])

function initialAnimation(): void {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top 15%',
            toggleActions: 'play pause resume reset',
        },
    });

    $state.forEach((s, ind) => {
        tl.to(socialLineRef.value[ind], {duration: .2, width: '5rem'});
        tl.to(socialItemRef.value[ind], {duration: .5, text: s.name});
    });
};

onMounted((): void => {
    initialAnimation()
})
</script>

<template>
    <footer
        :class="[$style.CommonContacts, 'section']"
        id="contacts"
        ref="sectionRef"
    >
        <h2 :class="[$style.title, 'title']">Contacts</h2>
        <div :class="$style.socials">
            <div
                v-for="(s, ind) in $state"
                :class="$style.social"
                :key="ind"
            >
                <a
                    :class="$style.socialLinks"
                    :href="s.link"
                    target="_blank"
                    rel="noreferrer"
                >
                    <UiVIcon
                        :name="s.icon"
                    />
                </a>
                <span ref="socialLineRef" />
                <a
                    ref="socialItemRef"
                    :class="$style.socialLink"
                    :href="s.link"
                    target="_blank"
                    rel="noreferrer"
                />
            </div>
        </div>
        <a
            href="https://beget.com/p2090273"
            target="_blank"
            :class="$style.logoWrap"
        >
            <p>Site posted:</p>
            <UiVIcon
                :class="$style.logo"
                name="beget"
                size="custom"
            />
        </a>
    </footer>
</template>

<style
    lang="scss"
    module
>
    .CommonContacts {
        display: grid;
        grid-template-columns: 2fr 4fr;
        padding-top: 20rem;
        gap: 10rem;

        @include respond-to(mobile) {
            grid-template-columns: 1fr;
            gap: 3.2rem;
            padding-top: 7.4rem;
        }
    }

    .title {
        grid-column: 1/3;

        @include respond-to(mobile) {
            grid-column: auto;
        }
    }

    .socials {
        display: grid;
        grid-template-rows: repeat(5, 4rem);
        align-self: end;
        gap: 3rem;

        @include respond-to(mobile) {
            gap: 2.4rem;
        }
    }

    .social {
        display: flex;
        align-items: center;

        span {
            display: inline-flex;
            height: 2px;
            background: $gray5;
            margin-right: 1rem;
        }

        @include respond-to(mobile) {
            font-size: 1.4rem;
        }
    }

    .socialLink {
        color: $gray5;
        font-size: 2rem;
        line-height: 140%;
        user-select: none;
    }

    .socialLinks {
        display: none;

        @include respond-to(mobile) {
            display: inline-block;
            margin-right: 1rem;
            color: $gray5;
        }
    }

    .logoWrap {
        display: flex;
        flex-direction: column;
        align-self: end;
        justify-self: end;
        font-size: 1.4rem;
        color: $gray5;
        transition: $default-transition;

        @include hover {
            color: $gray1;
        }
    }
</style>
