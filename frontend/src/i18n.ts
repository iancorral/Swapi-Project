import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Aquí defines tus textos (igual que en strings.xml)
const resources = {
  es: {
    translation: {
      "home_welcome": "Bienvenido, {{name}}",
      "section_sales": "Ventas",
      "section_rents": "Rentas",
      "section_services": "Servicios",
      "section_ads": "Anuncios",
      "see_more": "Ver más",
      // ... copia aquí tus strings de Android
    }
  },
  en: {
    translation: {
      "home_welcome": "Welcome, {{name}}",
      "section_sales": "Sales",
      // ...
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es", // idioma por defecto
    interpolation: { escapeValue: false }
  });

export default i18n;