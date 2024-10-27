function generateAndDownloadJSON() {
    // Получаем введенный текст в поле поиска
    const searchTerm = document.querySelector('.search-input').value;

    // Получаем все выбранные чекбоксы
    const checkboxes = document.querySelectorAll('input[name="field"]:checked');
    const selectedFields = [];

    // Заполняем массив значениями выбранных чекбоксов
    checkboxes.forEach(checkbox => {
        selectedFields.push(checkbox.value);
    });

    // Формируем объект JSON
    const jsonData = {
        searchTerm: searchTerm,
        selectedFields: selectedFields,
        timestamp: new Date().toISOString(),
        count: selectedFields.length
    };

    // Преобразуем объект в строку JSON
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Создаем элемент для скачивания файла
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json'; // Имя файла
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Освобождаем память
}

// Добавляем обработчики событий для текстового поля и чекбоксов
document.querySelector('.search-input').addEventListener('input', generateAndDownloadJSON);
document.querySelectorAll('input[name="field"]').forEach(checkbox => {
    checkbox.addEventListener('change', generateAndDownloadJSON);
});