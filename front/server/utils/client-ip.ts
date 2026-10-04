import type { H3Event } from "h3";

// nginx дописывает адрес клиента в конец X-Forwarded-For
// ($proxy_add_x_forwarded_for), начало цепочки клиент подделывает сам
export const getClientIp = (event: H3Event): string => {
	const chain = (getRequestHeader(event, "x-forwarded-for") || "")
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean);

	return chain.at(-1) || getRequestIP(event) || "unknown";
};
