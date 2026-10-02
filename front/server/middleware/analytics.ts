// Заходом считаем только загрузку страницы сайта: переходы внутри SPA
// на сервер не приходят, а API, статика и админка — не заходы
const SKIP_PREFIXES = [
	"/api",
	"/_nuxt",
	"/_ipx",
	"/__nuxt",
	"/uploads",
	"/admin",
	"/login",
];

export default defineEventHandler((event) => {
	if (event.method !== "GET") return;

	const path = getRequestURL(event).pathname;

	if (SKIP_PREFIXES.some((prefix) => path.startsWith(prefix))) return;
	// файлы вида /favicon.ico, /robots.txt
	if (/\.[a-z0-9]+$/i.test(path)) return;
	if (!getRequestHeader(event, "accept")?.includes("text/html")) return;

	// ответ не ждёт записи в БД
	trackVisit(event).catch((error) => {
		console.error("[analytics] не удалось записать заход", error);
	});
});
