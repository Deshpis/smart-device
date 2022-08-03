import {iosVhFix} from './utils/ios-vh-fix';
import {initModals} from './modules/modals/init-modals';
import {initAccordion} from './modules/accordion/init-accordion';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  // Utils
  // ---------------------------------

  iosVhFix();

  // Modules
  // ---------------------------------

  // Маска для телефона
  const inputPhone = document.querySelectorAll('[data-input="phone"]');

  if (inputPhone) {
    [].forEach.call(inputPhone, function (input) {
      let keyCode;
      function mask(event) {
        let pos = input.selectionStart;
        if (pos < 3) {
          event.preventDefault();
        }
        let matrix = '+7 (___) ___-__-__';
        let i = 0;
        let def = matrix.replace(/\D/g, '');
        let val = input.value.replace(/\D/g, '');
        let newValue = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
        });
        i = newValue.indexOf('_');
        if (i !== -1) {
          newValue = newValue.slice(0, i);
        }
        let reg = matrix.substr(0, input.value.length).replace(/_+/g,
            function (a) {
              return '\\d{1,' + a.length + '}';
            }).replace(/[+()]/g, '\\$&');
        reg = new RegExp('^' + reg + '$');
        if (!reg.test(input.value) || input.value.length < 5 || keyCode > 47 && keyCode < 58) {
          input.value = newValue;
        }
        if (event.type === 'blur' && input.value.length < 5) {
          input.value = '';
        }
      }
      input.addEventListener('input', mask, false);
      input.addEventListener('focus', mask, false);
      input.addEventListener('blur', mask, false);
      input.addEventListener('keydown', mask, false);
    });
  }

  // Смена кнопки в блоке "О компании"

  const companyDescription = document.querySelector('[data-element="company-description"]');
  const companyButtons = document.querySelectorAll('[data-element="company-more"]');

  if (companyDescription) {
    companyButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        if (companyDescription.classList.contains('company__description--closed')) {
          companyDescription.classList.remove('company__description--closed');
          companyDescription.classList.add('company__description--opened');
        } else {
          companyDescription.classList.add('company__description--closed');
          companyDescription.classList.remove('company__description--opened');
        }
      });
    });
  }

  // Сохранение формы в localstorage

  const feedbackForm = document.querySelector('[data-form="feedback"]');

  if (feedbackForm) {
    const feedbackName = document.querySelectorAll('[data-input="name"]');
    const feedbackPhone = document.querySelectorAll('[data-input="phone"]');
    const feedbackQuestion = document.querySelectorAll('[data-input="question"]');
    const feedbackInputs = [feedbackName, feedbackPhone, feedbackQuestion];
    const feedbackSubmit = document.querySelectorAll('[data-input="submit"]');

    const changeHandler = (element) => () => {
      localStorage.setItem(element.name, element.value);
    };

    const attachEvents = () => {
      for (let i = 0; i < feedbackInputs.length; i++) {
        for (let j = 0; j < feedbackInputs[i].length; j++) {
          feedbackInputs[i][j].addEventListener('change', changeHandler(feedbackInputs[i][j]));
        }
      }
    };

    const checkStorage = () => {
      for (let i = 0; i < feedbackInputs.length; i++) {
        for (let j = 0; j < feedbackInputs[i].length; j++) {
          feedbackInputs[i][j].value = localStorage.getItem(feedbackInputs[i][j].name);
        }
      }

      attachEvents();
    };

    checkStorage();

    const clearStorage = () => {
      localStorage.clear();
    };

    for (let i = 0; i < feedbackSubmit.length; i++) {
      feedbackSubmit[i].addEventListener('click', clearStorage);
    }
  }

  // Адаптивный JS
  const breakpoint = window.matchMedia('(max-width:767px)');
  const breakpointChecker = () => {
    if (breakpoint.matches) {
      // Смена кнопки в .promo
      const promoButton = document.querySelector('[data-element="get-consult"]');

      if (promoButton) {
        if (window.innerWidth < 768) {
          promoButton.innerText = 'Бесплатная консультация';
        }
      }

      // Смена заголовка в .services

      const serviceHeader = document.querySelector('[data-element="services-header"]');

      if (serviceHeader) {
        if (window.innerWidth < 768) {
          serviceHeader.innerText = 'Товары и услуги Smart Device';
        }
      }

      // Аккордион в футере

      const accordion = document.querySelector('[data-element="accordion"]');
      const accordionItem = document.querySelectorAll('[data-element="accordion-item"]');

      if (accordionItem) {
        accordionItem.forEach((el) => {
          el.classList.remove('accordion__item--show');
        });
      }

      if (accordion) {
        accordion.classList.remove('accordion--nojs');
        initAccordion();
      }
    }
  };
  breakpoint.addListener(breakpointChecker);
  breakpointChecker();

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана

  window.addEventListener('load', () => {
    initModals();

    // Фокус на поле "Имя"
    const callbackBtn = document.querySelector('[data-open-modal="callback"]');
    const modalCallback = document.querySelector('[data-modal="callback"]');

    if (callbackBtn) {
      callbackBtn.addEventListener('click', function () {
        const inputName = modalCallback.querySelector('[data-input="name"]');
        setTimeout(() => {
          inputName.focus();
        }, 100);
      });
    }
  });
});

// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используейтся matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)
