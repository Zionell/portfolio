const LIFE_SUCCESS = 2500;
const LIFE_ERROR = 6000;

export const useAdminToast = () => {
	const toast = useToast();
	const { session } = useUserSession();
	const route = useRoute();

	const statusOf = (error: unknown): number =>
		Number(
			(error as { data?: { statusCode?: number } })?.data?.statusCode,
		) || 0;

	const messageOf = (error: unknown, fallback: string): string => {
		const data = (error as { data?: Record<string, unknown> })?.data;

		if (statusOf(error) >= 500) return fallback;

		const detail = data?.statusMessage || data?.message;

		return typeof detail === "string" && detail ? detail : fallback;
	};

	const notifySaved = (detail = "Изменения сохранены") => {
		toast.add({
			severity: "success",
			summary: "Готово",
			detail,
			life: LIFE_SUCCESS,
		});
	};

	const notifyError = (error: unknown, fallback: string) => {
		console.error(fallback, error);

		if (statusOf(error) === 401) {
			// сервер сессию уже не признаёт — просто забываем её на клиенте
			session.value = null;

			toast.add({
				severity: "warn",
				summary: "Сессия истекла",
				detail: "Войдите заново",
				life: LIFE_ERROR,
			});

			if (route.path !== "/login") {
				navigateTo({
					path: "/login",
					query: { redirect: route.fullPath },
				});
			}

			return;
		}

		toast.add({
			severity: "error",
			summary: "Ошибка",
			detail: messageOf(error, fallback),
			life: LIFE_ERROR,
		});
	};

	return { notifySaved, notifyError, messageOf };
};
