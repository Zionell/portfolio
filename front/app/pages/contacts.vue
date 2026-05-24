<script setup lang="ts">
import ContactHero from "~/components/contacts/ContactHero.vue";
import { api } from "~/assets/data/api";
import type { IContacts } from "#shared/types/contact.types";
import ContactForm from "~/components/contacts/ContactForm.vue";

const { data } = await useFetch<IContacts>(api.contacts);
</script>

<template>
	<ContactHero v-if="data?.hero" :data="data.hero" />
	<ContactForm v-if="data?.contacts" :data="data.contacts" />
</template>

<style lang="scss" module></style>
