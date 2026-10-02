import { timingSafeEqual } from "node:crypto";
import type { H3Event } from "h3";

const ADMIN_EMAILS = ["studio.askarov@gmail.com", "askarov.adilhan@gmail.com"];

export const normalizeEmail = (value: unknown): string =>
	typeof value === "string" ? value.trim().toLowerCase() : "";

export const isAllowedEmail = (email: string): boolean =>
	ADMIN_EMAILS.includes(email);

export const safeEqual = (a: string, b: string): boolean => {
	const left = Buffer.from(a);
	const right = Buffer.from(b);

	if (left.length !== right.length) return false;

	return timingSafeEqual(left, right);
};

export const hasValidSkeletonToken = (event: H3Event): boolean => {
	const { skeletonApiToken } = useRuntimeConfig(event);

	if (!skeletonApiToken) return false;

	const authorization = getRequestHeader(event, "authorization") || "";
	const bearer = authorization.toLowerCase().startsWith("bearer ")
		? authorization.slice(7).trim()
		: "";
	const custom = getRequestHeader(event, "x-api-token")?.trim() || "";
	const provided = bearer || custom;

	return Boolean(provided) && safeEqual(provided, skeletonApiToken);
};
