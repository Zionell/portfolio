<script setup lang="ts">
</script>

<template>
    <main :class="$style.index">
		<HomeHero />
		<HomeAboutMe />
		<HomeExperience />
		<HomeSkills />
		<HomeWorks />
		<CommonContacts />
    </main>
</template>

<style lang="scss" module>
    .index {
        display: flex;
        flex-direction: column;
    }
</style>
