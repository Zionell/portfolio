export function cleanHtmlText(input: string): string {
	if (!input) return "";

	return (
		input
			// декодируем двойные сущности (&amp;nbsp; -> &nbsp;)
			.replace(/&amp;/g, "&")
			// заменяем nbsp на обычный пробел
			.replace(/&nbsp;/g, " ")
			// апострофы
			.replace(/&rsquo;/g, `'`)
			// убираем лишние пробелы
			.replace(/\s+/g, " ")
			.trim()
	);
}
