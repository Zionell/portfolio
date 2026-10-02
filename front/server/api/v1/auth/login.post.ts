export default defineEventHandler(async (event) => {
	const body = await readBody<{ email?: string; password?: string }>(event);
	const { adminPassword } = useRuntimeConfig(event);

	const email = normalizeEmail(body?.email);
	const password = typeof body?.password === "string" ? body.password : "";

	if (!adminPassword) {
		throw createError({
			statusCode: 500,
			statusMessage: "NUXT_ADMIN_PASSWORD is not set",
		});
	}

	if (!isAllowedEmail(email) || !safeEqual(password, adminPassword)) {
		console.warn(`[auth] неудачный вход с ${getClientIp(event)}`);

		await new Promise((resolve) => setTimeout(resolve, 400));

		throw createError({
			statusCode: 401,
			statusMessage: "Invalid credentials",
		});
	}

	await setUserSession(event, { user: { email } });

	return { email };
});
