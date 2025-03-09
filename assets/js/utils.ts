import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export function calculateAge(birthDateString: string): number {
	// Разбиваем строку "дд.мм.гггг" на части
	const [day, month, year] = birthDateString.split(".").map(Number);

	// Создаем объект даты рождения
	const birthDate = new Date(year, month - 1, day);

	// Получаем текущую дату
	const today = new Date();

	// Вычисляем возраст
	let age = today.getFullYear() - birthDate.getFullYear();

	// Проверяем, был ли день рождения в этом году
	const monthDiff = today.getMonth() - birthDate.getMonth();
	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birthDate.getDate())
	) {
		age--;
	}

	return age;
}

export function scrollToBlock(
	id: string,
	offset = 0,
	force = false,
	parentDocument: null | Document = null,
): void {
	const doc = parentDocument || document;
	const target = doc.getElementById(id || "__nuxt");

	if (target) {
		const position =
			target.getBoundingClientRect().top + window.pageYOffset;

		if (force) {
			window.scroll({
				top: position - offset,
				left: 0,
				behavior: "instant",
			});
		} else {
			gsap.to(window, {
				duration: 0.5,
				scrollTo: { y: position, offsetY: offset },
			});
		}
	}
}
