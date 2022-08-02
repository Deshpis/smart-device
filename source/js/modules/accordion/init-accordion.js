import {ItcAccordion} from './accordion';

let accordion;

const initAccordion = () => {
  accordion = new ItcAccordion(document.querySelector('.accordion'), {
    alwaysOpen: false,
  });
};

export {accordion, initAccordion};
