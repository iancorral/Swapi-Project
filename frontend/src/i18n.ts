import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      "home_welcome": "Bienvenido, {{name}}",
      "section_sales": "Ventas",
      "section_rents": "Rentas",
      "section_services": "Servicios",
      "section_ads": "Anuncios",
      "see_more": "Ver más",
      "no_posts_category": "No hay publicaciones en esta categoría."
    }
  },
  en: {
    translation: {
      "home_welcome": "Welcome, {{name}}",
      "section_sales": "Sales",
      "section_rents": "Rents",
      "section_services": "Services",
      "section_ads": "Ads",
      "see_more": "See more",
      "no_posts_category": "No posts in this category."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es", 
    interpolation: { escapeValue: false }
  });

export default i18n;