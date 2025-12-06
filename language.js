(function() {
    const TRANSLATOR_ID = '#ftgug97c7g';
    const STORAGE_KEY = 'selectedLanguage';

    function saveLanguage(lang) {
        localStorage.setItem(STORAGE_KEY, lang);
    }

    function applySavedLanguage(select) {
        const savedLang = localStorage.getItem(STORAGE_KEY);
        if (savedLang && select.value !== savedLang) {
            select.value = savedLang;
            select.dispatchEvent(new Event('input', { bubbles: true }));
            select.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('Language restored to:', savedLang);
        }
    }

    function setupListener(select) {
        if (!select.dataset.listenerAdded) {
            select.addEventListener('change', function() {
                saveLanguage(this.value);
                console.log('Language saved:', this.value);
            });
            select.dataset.listenerAdded = 'true';
        }
    }

    function initTranslator() {
        const select = document.querySelector(TRANSLATOR_ID + ' select');
        if (select && select.options.length > 0) { // make sure widget is fully loaded
            setupListener(select);
            applySavedLanguage(select);
            return true;
        }
        return false;
    }

    // Poll every 500ms until the widget is ready
    const interval = setInterval(() => {
        if (initTranslator()) clearInterval(interval);
    }, 500);

    // Watch for dynamic re-renders
    const observer = new MutationObserver(() => {
        initTranslator();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
