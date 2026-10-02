<script setup lang="ts">
definePageMeta({
	layout: "auth",
});

const route = useRoute();
const { fetch: fetchSession } = useUserSession();

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const canSubmit = computed(
	() => Boolean(email.value.trim() && password.value) && !isLoading.value,
);

const handleSubmit = async () => {
	if (!canSubmit.value) return;

	error.value = "";
	isLoading.value = true;

	try {
		await $fetch("/api/v1/auth/login", {
			method: "POST",
			body: { email: email.value, password: password.value },
		});
		await fetchSession();

		const redirect = route.query.redirect;
		await navigateTo(typeof redirect === "string" ? redirect : "/admin");
	} catch (err: any) {
		const status = err?.data?.statusCode;

		error.value =
			status === 401
				? "Почта или пароль не подходят"
				: err?.data?.statusMessage ||
					"Не удалось войти, попробуйте ещё раз";
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<PrimeCard :class="$style.card">
		<template #title>
			<p :class="$style.kicker">Portfolio content</p>
			<h1 :class="$style.title">Admin</h1>
		</template>

		<template #content>
			<form :class="$style.form" @submit.prevent="handleSubmit">
				<PrimeMessage
					v-if="error"
					severity="error"
					variant="simple"
					size="small"
				>
					{{ error }}
				</PrimeMessage>

				<PrimeFloatLabel variant="on">
					<PrimeInputText
						id="email"
						v-model="email"
						type="email"
						autocomplete="username"
						fluid
						:invalid="Boolean(error)"
					/>
					<label for="email">Почта</label>
				</PrimeFloatLabel>

				<PrimeFloatLabel variant="on">
					<PrimePassword
						id="password"
						v-model="password"
						:feedback="false"
						toggleMask
						fluid
						:invalid="Boolean(error)"
						inputId="password"
					/>
					<label for="password">Пароль</label>
				</PrimeFloatLabel>

				<PrimeButton
					type="submit"
					label="Войти"
					:loading="isLoading"
					:disabled="!canSubmit"
					fluid
				/>
			</form>
		</template>
	</PrimeCard>
</template>

<style lang="scss" module>
.card {
	width: 100%;
	max-width: 42rem;
}

.kicker {
	font-size: 1.1rem;
	letter-spacing: 0.24em;
	text-transform: uppercase;
	color: $gray4;
}

.title {
	font-size: 2.4rem;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	margin-top: 0.8rem;
}

.form {
	display: grid;
	gap: 2.4rem;
	padding-top: 1.2rem;
}
</style>
