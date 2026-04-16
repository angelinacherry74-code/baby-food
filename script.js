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

document.addEventListener('DOMContentLoaded', () => {
    updateBackButton();
});
