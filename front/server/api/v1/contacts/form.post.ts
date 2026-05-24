import type { IContactFormPayload } from "#shared/types/contact.types";
import { filterXSS, type IFilterXSSOptions } from "xss";

const limits: Record<keyof IContactFormPayload, number> = {
	name: 80,
	email: 254,
	message: 2000,
};

const emailRegExp = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;
const sanitizeOptions: IFilterXSSOptions = {
	whiteList: {},
	stripIgnoreTag: true,
	stripIgnoreTagBody: ["script", "style"],
	stripBlankChar: true,
};

const normalizeText = (value: unknown): string => {
	if (typeof value !== "string") {
		return "";
	}

	return value.trim().replace(/\r\n?/g, "\n");
};

const sanitizeText = (value: string): string => {
	return filterXSS(value, sanitizeOptions).trim();
};

const validateField = (
	field: keyof IContactFormPayload,
	value: string,
): string | null => {
	if (!value) {
		return "Field is required";
	}

	if (value.length > limits[field]) {
		return "Field is too long";
	}

	if (field === "email" && !emailRegExp.test(value)) {
		return "Email is invalid";
	}

	return null;
};

export default defineEventHandler(async (event) => {
	const body = await readBody<Partial<IContactFormPayload>>(event);

	if (!body || typeof body !== "object" || Array.isArray(body)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid request body",
		});
	}

	const payload: IContactFormPayload = {
		name: sanitizeText(normalizeText(body.name)),
		email: sanitizeText(normalizeText(body.email)).toLowerCase(),
		message: sanitizeText(normalizeText(body.message)),
	};

	const errors = Object.entries(payload).reduce<Record<string, string>>(
		(acc, [key, value]) => {
			const field = key as keyof IContactFormPayload;
			const error = validateField(field, value);

			if (error) {
				acc[field] = error;
			}

			return acc;
		},
		{},
	);

	if (Object.keys(errors).length) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid contact form data",
			data: { errors },
		});
	}

	await prisma.contactsRequests.create({
		data: {
			...payload,
			isRead: false,
		},
	});

	return { success: true };
});
