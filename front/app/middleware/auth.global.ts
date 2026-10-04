export default defineNuxtRouteMiddleware(async (to) => {
	const isAdmin = to.path === "/admin" || to.path.startsWith("/admin/");
	const isLogin = to.path === "/login";

	if (!isAdmin && !isLogin) return;

	const { loggedIn, fetch } = useUserSession();

	// перечитываем сессию на каждом переходе: она могла истечь или быть
	// закрыта из соседней вкладки, а состояние на клиенте об этом не знает
	await fetch();

	if (isAdmin && !loggedIn.value) {
		return navigateTo({
			path: "/login",
			query: to.fullPath === "/admin" ? {} : { redirect: to.fullPath },
		});
	}

	if (isLogin && loggedIn.value) {
		return navigateTo("/admin");
	}
});
