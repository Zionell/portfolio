<script setup lang="ts">
</script>

<template>
    <main :class="$style.index">
		<Hero />
		<AboutMe />
		<Experience />
		<Skills />
		<Works />
		<Contacts />
    </main>
</template>

<style lang="scss" module>
    .index {
        display: flex;
        flex-direction: column;
    }
</style>
