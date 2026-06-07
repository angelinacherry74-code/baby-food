let currentScreen = 'welcome-screen';
const screenHistory = [];

function showScreen(screenId, pushHistory = true) {
    // 1. Знаходимо всі великі блоки (екрани) всередині контейнера
    const screens = ['welcome-screen', 'check-screen', 'age-screen', 'result-6', 'result-7', 'result-8', 'result-9', 'result-10', 'result-11', 'result-12'];

    // 2. Ховаємо абсолютно всі екрани
    screens.forEach(id => {
        const screen = document.getElementById(id);
        if (screen) {
            screen.style.display = 'none';
        }
    });

    // 3. Показуємо тільки той, який нам потрібен зараз
    const nextScreen = document.getElementById(screenId);
    if (nextScreen) {
        nextScreen.style.display = 'block';
    }

    if (pushHistory && currentScreen !== screenId) {
        screenHistory.push(currentScreen);
    }

    currentScreen = screenId;
    updateBackButton();
}

function goBack() {
    if (screenHistory.length > 0) {
        const previousScreen = screenHistory.pop();
        showScreen(previousScreen, false);
    } else {
        showScreen('welcome-screen', false);
    }
}

function updateBackButton() {
    const backBtn = document.getElementById('back-btn');
    if (!backBtn) return;
    backBtn.style.display = currentScreen === 'welcome-screen' ? 'none' : 'inline-flex';
}

const initUI = () => {
    updateBackButton();

    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    if (!navToggle || !nav) return;

    navToggle.addEventListener('click', () => {
        const opened = nav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(opened));
        navToggle.textContent = opened ? '✕' : '☰';
    });

    // Закриваємо меню при кліку на посилання
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.textContent = '☰';
        });
    });

    // Закриваємо меню при кліку поза ним
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && nav.classList.contains('open')) {
            nav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.textContent = '☰';
        }
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
} else {
    initUI();
}

function calculateVaccines() {
    const birthDateValue = document.getElementById('birthDate').value;
    if (!birthDateValue) {
        alert("Будь ласка, оберіть дату");
        return;
    }

    const birthDate = new Date(birthDateValue);
    const resultsDiv = document.getElementById('vaccineResult');
    
    // Дані зі схеми МОЗ (місяці та назви щеплень)
    const schedule = [
        { age: "2 дні", offsetDays: 2, title: "Туберкульоз (БЦЖ)" },
        { age: "2 місяці", offsetMonths: 2, title: "Гепатит В, АКДП, Поліомієліт, ХІБ + [Рекомендовано: Ротавірус, Пневмокок]" },
        { age: "4 місяці", offsetMonths: 4, title: "АКДП, Поліомієліт, ХІБ + [Рекомендовано: Ротавірус, Пневмокок]" },
        { age: "6 місяців", offsetMonths: 6, title: "Гепатит В, АКДП, Поліомієліт + [Рекомендовано: Ротавірус]" },
        { age: "12 місяців", offsetMonths: 12, title: "КПК (Кір, паротит, краснуха), ХІБ + [Рекомендовано: Пневмокок, Вітрянка]" },
        { age: "18 місяців", offsetMonths: 18, title: "АКДП, Поліомієліт" }
    ];

   let html = '<table><tr><th>Вік</th><th>Дата</th><th>Вакцини</th><th>Нагадування</th></tr>';

    schedule.forEach(item => {
        let vDate = new Date(birthDate);
        if (item.offsetDays) {
            vDate.setDate(vDate.getDate() + item.offsetDays);
        } else {
            vDate.setMonth(vDate.getMonth() + item.offsetMonths);
        }
        
        const dateStr = vDate.toLocaleDateString('uk-UA');
        
        // Формируем ссылку для Google Календаря
        // Формат даты для Google: ГГГГММДД
        const isoDate = vDate.toISOString().replace(/-|:|\.\d\d\d/g, "").split('T')[0];
        const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Щеплення: ' + item.title)}&dates=${isoDate}/${isoDate}&details=Нагадування від вашого помічника з прикорму`;

        html += `<tr>
            <td>${item.age}</td>
            <td>${dateStr}</td>
            <td>${item.title}</td>
            <td><a href="${calendarUrl}" target="_blank" class="calendar-btn">🗓 Додати</a></td>
        </tr>`;
    });

    html += '</table>';
    resultsDiv.innerHTML = html;
}