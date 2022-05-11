/* eslint-disable import/extensions */
import * as keysModule from './keys.js';

const KEYS = keysModule.default;

const form = document.createElement('form');
const textArea = document.createElement('textarea');
const keyboard = document.createElement('div');

let language = 'en';
let capsEnabled = false;
let shiftPressed = false;
let leftShiftPressed = false;
let rightShiftPressed = false;

function setLocalStorage() {
  localStorage.setItem('language', language);
}

function getLocalStorage() {
  if (localStorage.getItem('language')) {
    language = localStorage.getItem('language');
  }
}

getLocalStorage();
window.addEventListener('beforeunload', setLocalStorage);

function createForm() {
  form.classList.add('container');
  document.body.appendChild(form);

  textArea.rows = '10';
  textArea.autofocus = 'true';
  form.appendChild(textArea);

  keyboard.classList.add('keyboard');
  form.appendChild(keyboard);
}

function createKeys(currentLang) {
  for (let row = 0; row < KEYS.length; row += 1) {
    const keysRow = document.createElement('div');
    keysRow.classList.add('keyboard__row');

    for (let key = 0; key < KEYS[row].length; key += 1) {
      const newKey = KEYS[row][key];

      let elementClass = 'key';

      if (newKey.fn !== 'letter') {
        if (newKey.fn === 'backspace'
        || newKey.fn === 'rightShift'
        || newKey.fn === 'leftShift'
        || newKey.fn === 'tab'
        || newKey.fn === 'del'
        || newKey.fn === 'enter') {
          elementClass = 'key key_large key_dark';
        } else if (newKey.fn === 'space') {
          elementClass = 'key key_large';
        } else {
          elementClass = 'key key_dark';
        }
      }

      keysRow.innerHTML += `<div class="${elementClass}"
          data-fn="${newKey.fn}" 
          data-en="${newKey.en}" 
          data-en-shift="${newKey.enShift}"
          data-ru="${newKey.ru}" 
          data-ru-shift="${newKey.ruShift}">
          ${(newKey.fn === 'space') ? currentLang.toUpperCase() : newKey[currentLang]}
        </div>`;
    }

    keyboard.appendChild(keysRow);
  }
}

createForm();
createKeys(language);
form.appendChild(document.createElement('div')).innerHTML = 'To change language press Ctrl + Alt';
form.appendChild(document.createElement('div')).innerHTML = 'Для того, чтобы проверить пункт с использванием ESLint, склонируйте репозиторий: <a href="https://github.com/VLeshkov/virtual-keyboard">virtual-keyboard</a>';

const keys = document.querySelectorAll('.key');
keys.forEach((key) => {
  if (key.dataset.fn !== 'letter') {
    const currentKey = key;
    currentKey.id = key.dataset.fn;
  }
});

const capsLock = document.getElementById('capsLock');
const leftShift = document.getElementById('leftShift');
const rightShift = document.getElementById('rightShift');
const leftCtrl = document.getElementById('leftCtrl');
const rightCtrl = document.getElementById('rightCtrl');
const leftAlt = document.getElementById('leftAlt');
const rightAlt = document.getElementById('rightAlt');
const tab = document.getElementById('tab');
const backSpace = document.getElementById('backspace');
const del = document.getElementById('del');
const enter = document.getElementById('enter');
const arrowUp = document.getElementById('arrowUp');
const arrowDown = document.getElementById('arrowDown');
const arrowLeft = document.getElementById('arrowLeft');
const arrowRight = document.getElementById('arrowRight');
const space = document.getElementById('space');

const circleAnim = document.createElement('div');
circleAnim.classList.add('circle');

function playCircleAnimation(element) {
  element.appendChild(circleAnim);
  const newAnim = element.querySelector('.circle');

  newAnim.addEventListener('animationend', () => {
    newAnim.remove();
  });
}

function updateKeys(currentLang, capsStatus, shiftStatus) {
  let keyParameter = '';
  keyParameter = (shiftStatus) ? `${currentLang}Shift` : currentLang;

  if (capsStatus) {
    keys.forEach((key) => {
      const currentKey = key;
      if (shiftStatus) {
        if (key.dataset.fn === 'letter') {
          currentKey.textContent = key.dataset[keyParameter].toLowerCase();
        } else if (key.dataset.fn === 'space') {
          currentKey.textContent = currentLang.toUpperCase();
        }
        capsLock.classList.add('active');
      } else {
        if (key.dataset.fn === 'letter') {
          currentKey.textContent = key.dataset[keyParameter].toUpperCase();
        } else if (key.dataset.fn === 'space') {
          currentKey.textContent = currentLang.toUpperCase();
        }
        capsLock.classList.add('active');
      }
    });
  } else {
    keys.forEach((key) => {
      const currentKey = key;
      if (key.dataset.fn === 'letter') {
        currentKey.textContent = key.dataset[keyParameter];
      } else if (key.dataset.fn === 'space') {
        currentKey.textContent = currentLang.toUpperCase();
      }
    });
    capsLock.classList.remove('active');
  }
}

function keyPress(key) {
  if (key.dataset.fn === 'letter') {
    const textContent = textArea.value.split('');
    const cursorPosition = textArea.selectionStart;
    const deleteCount = (textArea.selectionStart === textArea.selectionEnd)
      ? 0 : textArea.selectionEnd - textArea.selectionStart;
    textContent.splice(cursorPosition, deleteCount, key.textContent.trim());
    textArea.value = textContent.join('');
    textArea.selectionEnd = cursorPosition + 1;
  } else if (key.dataset.fn === 'space') {
    const textContent = textArea.value.split('');
    const cursorPosition = textArea.selectionStart;
    const deleteCount = (textArea.selectionStart === textArea.selectionEnd)
      ? 0 : textArea.selectionEnd - textArea.selectionStart;
    textContent.splice(cursorPosition, deleteCount, ' ');
    textArea.value = textContent.join('');
    textArea.selectionEnd = cursorPosition + 1;
  } else if (key.dataset.fn === 'backspace') {
    // textArea.value = textArea.value.split('').slice(0, -1).join('');

    const textContent = textArea.value.split('');
    const cursorPosition = textArea.selectionStart;
    let positionFix = 0;
    if (textArea.selectionStart !== textArea.selectionEnd) {
      positionFix = 1;
    }

    const deleteCount = (textArea.selectionStart === textArea.selectionEnd)
      ? 1 : textArea.selectionEnd - textArea.selectionStart;

    textContent.reverse().splice(textArea.value.length - textArea.selectionEnd, deleteCount);
    textArea.value = textContent.reverse().join('');
    textArea.selectionEnd = (!cursorPosition) ? cursorPosition : cursorPosition + positionFix - 1;
  } else if (key.dataset.fn === 'tab') {
    textArea.value += '\t';
  } else if (key.dataset.fn === 'enter') {
    textArea.value += '\n';
  } else if (key.dataset.fn === 'del') {
    const textContent = textArea.value.split('');
    const cursorPosition = textArea.selectionStart;

    const deleteCount = (textArea.selectionStart === textArea.selectionEnd)
      ? 1 : textArea.selectionEnd - textArea.selectionStart;

    textContent.splice(cursorPosition, deleteCount);
    textArea.value = textContent.join('');
    textArea.selectionEnd = cursorPosition;
  } else if (key.dataset.fn === 'capsLock') {
    capsEnabled = !(capsEnabled);
    updateKeys(language, capsEnabled, shiftPressed);
  } else if (key.dataset.fn === 'leftShift') {
    shiftPressed = true;
    leftShiftPressed = true;
    leftShift.classList.toggle('active');
    updateKeys(language, capsEnabled, shiftPressed);
  } else if (key.dataset.fn === 'rightShift') {
    shiftPressed = true;
    rightShiftPressed = true;
    rightShift.classList.toggle('active');
    updateKeys(language, capsEnabled, shiftPressed);
  } else if (key.dataset.fn === 'rightCtrl' || key.dataset.fn === 'leftCtrl') {
    if (rightAlt.classList.contains('active') || leftAlt.classList.contains('active')) {
      language = (language === 'ru') ? 'en' : 'ru';
      updateKeys(language, capsEnabled, shiftPressed);
    }
  } else if (key.dataset.fn === 'rightAlt' || key.dataset.fn === 'leftAlt') {
    if (rightCtrl.classList.contains('active') || leftCtrl.classList.contains('active')) {
      language = (language === 'ru') ? 'en' : 'ru';
      updateKeys(language, capsEnabled, shiftPressed);
    }
  } else if (key.dataset.fn === 'arrowRight') {
    textArea.focus();
    const selection = window.getSelection();
    selection.modify('move', 'forward', 'character');
  } else if (key.dataset.fn === 'arrowLeft') {
    textArea.focus();
    const selection = window.getSelection();
    selection.modify('move', 'backward', 'character');
  } else if (key.dataset.fn === 'arrowUp') {
    textArea.focus();
    const selection = window.getSelection();
    selection.modify('move', 'backward', 'line');
  } else if (key.dataset.fn === 'arrowDown') {
    textArea.focus();
    const selection = window.getSelection();
    selection.modify('move', 'forward', 'line');
  }
  textArea.focus();
}

form.addEventListener('keydown', (event) => {
  function pressButton(btn) {
    playCircleAnimation(btn);
    btn.click();
    btn.classList.add('active');
  }

  if (event.key === 'CapsLock') {
    capsLock.click();
  } else if (event.code === 'ShiftLeft') {
    pressButton(leftShift);
  } else if (event.code === 'ShiftRight') {
    pressButton(rightShift);
  } else if (event.code === 'ControlLeft') {
    pressButton(leftCtrl);
  } else if (event.code === 'ControlRight') {
    pressButton(rightCtrl);
  } else if (event.code === 'AltLeft') {
    pressButton(leftAlt);
  } else if (event.code === 'AltRight') {
    pressButton(rightAlt);
  } else if (event.code === 'Tab') {
    event.preventDefault();
    pressButton(tab);
  } else if (event.code === 'Backspace') {
    event.preventDefault();
    pressButton(backSpace);
  } else if (event.code === 'Delete') {
    event.preventDefault();
    pressButton(del);
  } else if (event.code === 'Enter') {
    event.preventDefault();
    pressButton(enter);
  } else if (event.code === 'ArrowUp') {
    event.preventDefault();
    pressButton(arrowUp);
  } else if (event.code === 'ArrowDown') {
    event.preventDefault();
    pressButton(arrowDown);
  } else if (event.code === 'ArrowLeft') {
    event.preventDefault();
    pressButton(arrowLeft);
  } else if (event.code === 'ArrowRight') {
    event.preventDefault();
    pressButton(arrowRight);
  } else if (event.code === 'Space') {
    event.preventDefault();
    pressButton(space);
  } else {
    event.preventDefault();
    keys.forEach((key) => {
      if (key.dataset.en === event.key.toLowerCase()
          || key.dataset.enShift === event.key.toLowerCase()) {
        pressButton(key);
      }
    });
  }
});

textArea.addEventListener('keyup', (event) => {
  if (event.code === 'ControlLeft') {
    leftCtrl.classList.remove('active');
  } else if (event.code === 'ControlRight') {
    rightCtrl.classList.remove('active');
  } else if (event.code === 'AltLeft') {
    leftAlt.classList.remove('active');
  } else if (event.code === 'AltRight') {
    rightAlt.classList.remove('active');
  } else if (event.code === 'ShiftLeft') {
    leftShift.classList.remove('active');
    shiftPressed = rightShiftPressed;
    leftShiftPressed = false;
    updateKeys(language, capsEnabled, shiftPressed);
  } else if (event.code === 'ShiftRight') {
    rightShift.classList.remove('active');
    shiftPressed = leftShiftPressed;
    rightShiftPressed = false;
    updateKeys(language, capsEnabled, shiftPressed);
  } else if ((event.code === 'Tab')) {
    tab.classList.remove('active');
  } else if ((event.code === 'Backspace')) {
    backSpace.classList.remove('active');
  } else if ((event.code === 'Delete')) {
    del.classList.remove('active');
  } else if ((event.code === 'Enter')) {
    enter.classList.remove('active');
  } else if (event.code === 'ArrowUp') {
    arrowUp.classList.remove('active');
  } else if (event.code === 'ArrowDown') {
    arrowDown.classList.remove('active');
  } else if (event.code === 'ArrowLeft') {
    arrowLeft.classList.remove('active');
  } else if (event.code === 'ArrowRight') {
    arrowRight.classList.remove('active');
  } else {
    keys.forEach((key) => {
      if (key.dataset.en === event.key.toLowerCase()
          || key.dataset.enShift === event.key.toLowerCase()) {
        key.classList.remove('active');
      }
    });
  }
});

keys.forEach((key) => key.addEventListener('click', (event) => { keyPress(event.target); }));
