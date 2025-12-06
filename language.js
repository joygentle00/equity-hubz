(function() {
    const TRANSLATOR_ID = '#ftgug97c7g';
    const STORAGE_KEY = 'selectedLanguage';

    // Save language to localStorage
    function saveLanguage(lang) {
        localStorage.setItem(STORAGE_KEY, lang);
    }

    // Apply saved language
    function applySavedLanguage(select) {
        const savedLang = localStorage.getItem(STORAGE_KEY);
        if (savedLang && select.value !== savedLang) {
            select.value = savedLang;
            // Try triggering native events
            select.dispatchEvent(new Event('input', { bubbles: true }));
            select.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('Language restored to:', savedLang);
        }
    }

    // Setup listener for change
    function setupListener(select) {
        if (!select.dataset.listenerAdded) {
            select.addEventListener('change', function() {
                saveLanguage(this.value);
                console.log('Language saved:', this.value);
            });
            select.dataset.listenerAdded = 'true';
        }
    }

    // Poll until the select exists and apply
   const interval = setInterval(() => {
    const select = document.querySelector(TRANSLATOR_ID + ' select');
    if (select) {
        clearInterval(interval);
        setupListener(select);
        applySavedLanguage(select);
    }
}, 500); // slightly longer to ensure widget loads


    // Re-check on page load / DOMContentLoaded
    ['DOMContentLoaded', 'load'].forEach(event => {
        document.addEventListener(event, () => {
            const select = document.querySelector(TRANSLATOR_ID + ' select');
            if (select) {
                setupListener(select);
                applySavedLanguage(select);
            }
        });
    });
})();
