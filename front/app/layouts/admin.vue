<script setup lang="ts">
useHead({
	meta: [
		{ charset: "utf-8" },
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1, user-scalable=no",
		},
		{ name: "robots", content: "noindex, nofollow" },
	],
});

const route = useRoute();
const { user, clear } = useUserSession();
const { notifyError } = useAdminToast();

const isLoggingOut = ref(false);

const handleLogout = async () => {
	isLoggingOut.value = true;

	try {
		await clear();
		await navigateTo("/login");
	} catch (error) {
		notifyError(error, "Не удалось выйти");
	} finally {
		isLoggingOut.value = false;
	}
};

const menu = [
	{ label: "Home page", to: "/admin" },
	{ label: "Projects", to: "/admin/projects" },
	{ label: "Blog", to: "/admin/blog" },
	{ label: "Settings", to: "/admin/settings" },
];
</script>

<template>
	<div :class="$style.admin">
		<aside :class="$style.sidebar">
			<div :class="$style.brand">
				<p :class="$style.brandTitle">Admin</p>
				<p :class="$style.brandSubtitle">Portfolio content</p>
			</div>
			<nav :class="$style.nav">
				<NuxtLink
					v-for="item in menu"
					:key="item.to"
					:to="item.to"
					:class="[
						$style.navLink,
						{ [$style._active]: route.path === item.to },
					]"
				>
					{{ item.label }}
				</NuxtLink>
			</nav>

			<div :class="$style.account">
				<p v-if="user" :class="$style.email">{{ user.email }}</p>
				<PrimeButton
					label="Выйти"
					severity="secondary"
					variant="outlined"
					size="small"
					:loading="isLoggingOut"
					@click="handleLogout"
				/>
			</div>
		</aside>
		<PrimeToast position="top-right" />

		<main :class="$style.main">
			<slot />
		</main>
	</div>
</template>

<style lang="scss" module>
.admin {
	min-height: 100vh;
	display: grid;
	grid-template-columns: 24rem 1fr;
	background: #0a0a0a;
	color: $white;
}

.sidebar {
	padding: 3.2rem 2.4rem;
	border-right: 1px solid rgba(255, 255, 255, 0.08);
	background: rgba(0, 0, 0, 0.85);
	backdrop-filter: blur(18px);
	display: grid;
	gap: 3.2rem;
	align-content: start;
}

.brandTitle {
	font-size: 1.8rem;
	letter-spacing: 0.2em;
	text-transform: uppercase;
}

.brandSubtitle {
	font-size: 1.2rem;
	color: $gray4;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	margin-top: 0.6rem;
}

.nav {
	display: grid;
	gap: 1.2rem;
}

.navLink {
	text-decoration: none;
	color: $gray4;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	font-size: 1.1rem;
	transition: $default-transition;

	&:hover {
		color: $white;
	}

	&._active {
		color: $white;
	}
}

.account {
	display: grid;
	gap: 1.2rem;
	justify-items: start;
	padding-top: 2.4rem;
	border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.email {
	font-size: 1.1rem;
	color: $gray4;
	word-break: break-all;
}

.main {
	display: flex;
	padding: 4rem;
}
</style>
