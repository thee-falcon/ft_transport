/**
 * Language Utilities for handling translations and language switching
 */
class LanguageUtils {
    static supportedLanguages = {
        'en': 'English',
        'fr': 'Français',
        'ar': 'العربية'
    };

    static currentLanguage = 'en'; // Default language
    static translations = {};

    /**
     * Initialize language on page load
     */
    static initializeLanguage() {
        // Try to load language from localStorage
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && this.supportedLanguages[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }
        
        // Set document direction based on language
        this.setDocumentDirection();
        
        // Load translations
        this.loadTranslations();
        
        // Add MutationObserver to watch for DOM changes
        this.setupDOMObserver();
    }

    /**
     * Set document direction based on language (RTL for Arabic)
     */
    static setDocumentDirection() {
        if (this.currentLanguage === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
        }
    }

    /**
     * Load translations for the current language
     */
    static async loadTranslations() {
        try {
            const response = await fetch(`/static/locales/${this.currentLanguage}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.translations = await response.json();
            this.applyTranslations();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    /**
     * Apply translations to all elements with data-i18n attribute
     * @param {HTMLElement} rootElement - Optional root element to start from (defaults to document)
     */
    static applyTranslations(rootElement = document) {
        const elements = rootElement.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[key]) {
                element.textContent = this.translations[key];
            }
        });
        
        // Also translate elements with title attributes that need translation
        const elementsWithTitle = rootElement.querySelectorAll('[data-i18n-title]');
        elementsWithTitle.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            if (this.translations[key]) {
                element.title = this.translations[key];
            }
        });
        
        // Translate placeholder attributes
        const elementsWithPlaceholder = rootElement.querySelectorAll('[data-i18n-placeholder]');
        elementsWithPlaceholder.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (this.translations[key]) {
                element.placeholder = this.translations[key];
            }
        });
    }

    /**
     * Observe DOM changes and apply translations to new elements
     */
    static setupDOMObserver() {
        // Create MutationObserver to watch for new elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            this.applyTranslations(node);
                            
                            // Also check child elements
                            if (node.querySelectorAll) {
                                this.applyTranslations(node);
                            }
                        }
                    });
                }
            });
        });
        
        // Start observing with configuration
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Get translation for a specific key
     * @param {string} key - The translation key
     * @returns {string} The translated text or the key if not found
     */
    static translate(key) {
        return this.translations[key] || key;
    }

    /**
     * Change the current language
     * @param {string} language - The language code to change to
     */
    static async changeLanguage(language) {
        if (this.supportedLanguages[language]) {
            this.currentLanguage = language;
            localStorage.setItem('language', language);
            
            // Update document direction for RTL languages
            this.setDocumentDirection();
            
            // Load and apply translations
            await this.loadTranslations();
            
            // Dispatch custom event for language change
            const event = new CustomEvent('languageChanged', {
                detail: { language: language }
            });
            window.dispatchEvent(event);
        }
    }

    /**
     * Create a language selector dropdown
     * @returns {HTMLElement} The language selector element
     */
    static createLanguageSelector() {
        const container = document.createElement('div');
        container.className = 'language-selector';

        const select = document.createElement('select');
        select.id = 'language-select';
        
        // Add language options
        for (const [code, name] of Object.entries(this.supportedLanguages)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            if (code === this.currentLanguage) {
                option.selected = true;
            }
            select.appendChild(option);
        }

        // Add event listener
        select.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        container.appendChild(select);
        return container;
    }

    /**
     * Helper function to create HTML with translations
     * This is useful for dynamically created content
     * @param {string} elementType - Type of HTML element to create (e.g., 'div', 'span', 'button')
     * @param {string} textKey - Translation key for the text content
     * @param {Object} attributes - Object with attributes to set on the element
     * @returns {HTMLElement} The created element with translations applied
     */
    static createTranslatedElement(elementType, textKey, attributes = {}) {
        const element = document.createElement(elementType);
        
        // Set text with translation
        element.setAttribute('data-i18n', textKey);
        element.textContent = this.translate(textKey);
        
        // Set additional attributes
        for (const [key, value] of Object.entries(attributes)) {
            if (key === 'className') {
                element.className = value;
            } else {
                element.setAttribute(key, value);
            }
        }
        
        return element;
    }
}

// Make it globally available
window.LanguageUtils = LanguageUtils; 