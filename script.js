// Пример JavaScript для управления отображением секций
document.addEventListener("DOMContentLoaded", function() {
    const projectsSection = document.getElementById('projects');
    const aboutSection = document.getElementById('about');
    const contactSection = document.getElementById('contact');

    // Функция для отображения секции
    function showSection(section) {
        // Скрыть все секции
        projectsSection.classList.add('hidden');
        aboutSection.classList.add('hidden');
        contactSection.classList.add('hidden');

        // Показать нужную секцию
        section.classList.remove('hidden');
        section.classList.add('visible');
    }

    // Пример, как вы можете вызвать функцию
    // Вы можете вызывать showSection по клику на навигационные ссылки
    document.querySelector('nav ul li a[href="#projects"]').addEventListener('click', function() {
        showSection(projectsSection);
    });

    document.querySelector('nav ul li a[href="#about"]').addEventListener('click', function() {
        showSection(aboutSection);
    });

    document.querySelector('nav ul li a[href="#contact"]').addEventListener('click', function() {
        showSection(contactSection);
    });

    // Изначально показываем секцию проектов
    showSection(projectsSection);
});
