export function calculateAge(birthDateString: string): number {
    // Разбиваем строку "дд.мм.гггг" на части
    const [day, month, year] = birthDateString.split('.').map(Number);

    // Создаем объект даты рождения
    const birthDate = new Date(year, month - 1, day);

    // Получаем текущую дату
    const today = new Date();

    // Вычисляем возраст
    let age = today.getFullYear() - birthDate.getFullYear();

    // Проверяем, был ли день рождения в этом году
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}