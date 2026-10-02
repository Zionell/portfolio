const PROTECTED = ["/api/v1/admin", "/api/v1/upload"];
// токен внешнего сборщика PR умеет только создавать скелетон — читать
// и удалять их можно лишь из админки по сессии
const TOKEN_ROUTE = { method: "POST", path: "/api/v1/admin/skeleton" };

export default defineEventHandler(async (event) => {
	const path = getRequestURL(event).pathname;

	if (!PROTECTED.some((prefix) => path.startsWith(prefix))) return;

	if (
		event.method === TOKEN_ROUTE.method &&
		path.replace(/\/+$/, "") === TOKEN_ROUTE.path &&
		hasValidSkeletonToken(event)
	) {
		return;
	}

	// без сессии бросает 401
	await requireUserSession(event);
});
