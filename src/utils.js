const $ = (arg) => document.querySelector(arg);

const $$ = (args) => document.querySelectorAll(args);

const $text = (arg, text) => ($(arg).innerText = text);

const $val = (arg) => $(arg).value;

const addClass = (element, className) => {
  element.classList.add(className);
};

const removeClass = (element, className) => {
  element.classList.remove(className);
};

const setLS = (key, value) => localStorage.setItem(key, value);

const getLS = (key) => localStorage.getItem(key);

const create = (node) => {
  return document.createElement(node);
};
