import type { IProjectDetail } from "#shared/types/project.types";

/**
 * Общая обвязка для всех шаблонов детальной страницы проекта.
 * Сами шаблоны отличаются только вёрсткой, данные готовятся одинаково.
 *
 * Статуса «в разработке / архив» здесь нет намеренно: на детальной странице
 * он живёт в надзаголовке (eyebrow), который заполняется в админке.
 * Цветная плашка рядом с ним дублировала тот же текст.
 */
export const useProjectDetail = (project: Ref<IProjectDetail>) => {
	// у живой ссылки подписи в базе нет — берём хост. Полный адрес с путём и
	// query переносится на вторую строку и утаскивает за собой стрелку
	const hostOf = (url: string): string => {
		try {
			return new URL(url).host.replace(/^www\./, "");
		} catch {
			return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
		}
	};

	// ссылка на живой сайт хранится отдельным полем — показываем её
	// первой, дальше идут произвольные ресурсы из админки
	const links = computed(() => {
		const list = project.value.links ?? [];

		if (!project.value.link) return list;

		return [
			{
				id: "live",
				label: hostOf(project.value.link),
				url: project.value.link,
			},
			...list,
		];
	});

	const counter = (index: number): string =>
		String(index + 1).padStart(2, "0");

	return { links, counter };
};
