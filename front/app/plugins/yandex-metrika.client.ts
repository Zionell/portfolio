type Ym = ((id: number, method: string, ...args: unknown[]) => void) & {
	a?: IArguments[];
	l?: number;
};

declare global {
	interface Window {
		ym?: Ym;
	}
}

// без ?id с init({ ssr: true }) tag.js загружается, но очередь ym не разбирает
const tagUrl = (id: number) => `https://mc.yandex.ru/metrika/tag.js?id=${id}`;

// админку и логин в Метрику не отправляем
const isTracked = (path: string) =>
	!path.startsWith("/admin") && !path.startsWith("/login");

// Стандартный сниппет Метрики, но без inline-скрипта: так он проходит CSP
// по nonce/strict-dynamic, а переходы внутри SPA уходят как хиты
export default defineNuxtPlugin(() => {
	const id = Number(useRuntimeConfig().public.yandexMetrikaId);

	// в dev не грузим, чтобы локальные заходы не попадали в статистику
	if (!id || import.meta.dev) return;

	const router = useRouter();
	let isLoaded = false;

	const load = () => {
		isLoaded = true;

		// как в сниппете Метрики: очередь из arguments до загрузки tag.js
		const ym: Ym = function () {
			(ym.a = ym.a || []).push(arguments);
		};
		ym.l = Date.now();
		window.ym = ym;

		const script = document.createElement("script");
		script.async = true;
		script.src = tagUrl(id);
		document.head.appendChild(script);

		ym(id, "init", {
			ssr: true,
			webvisor: true,
			clickmap: true,
			accurateTrackBounce: true,
			trackLinks: true,
		});
	};

	if (isTracked(router.currentRoute.value.path)) load();

	router.afterEach((to, from) => {
		// у начальной навигации from — пустой START_LOCATION, её хит уже
		// отправил init
		if (!from.matched.length) return;
		if (!isTracked(to.path) || to.fullPath === from.fullPath) return;

		// первый хит отправляет init, повторный дал бы двойной просмотр
		if (!isLoaded) {
			load();

			return;
		}

		window.ym?.(id, "hit", to.fullPath, {
			referer: window.location.origin + from.fullPath,
		});
	});
});
