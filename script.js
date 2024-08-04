const words = 100;
const apiUrl = 'https://random-word-api.herokuapp.com/word?number=' + words;
let dataStorage = [];
let currentIndex = 0;
const textElement = document.getElementById('text');
const inputElement = document.getElementById('input');
let originalText = "";

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    dataStorage = data;
    originalText = dataStorage.join(" ");
    displayColoredText("");
  });

const timer = document.getElementById('timer');
let timeLeft = 30; // changed to 30 seconds
let timerInterval;

const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

const wordsTypedElement = document.getElementById('wordsTyped');
const wordsCorrectElement = document.getElementById('wordsCorrect');
const accuracyElement = document.getElementById('accuracy');
const wpmElement = document.getElementById('wpm');

let wordsTyped = 0;
let wordsCorrect = 0;

startBtn.addEventListener('click', () => {
  resetTimer();
  inputElement.disabled = false;
  timerInterval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timerInterval);
      timer.textContent = 'Time is up!';
      inputElement.disabled = true;
      calculateResults();
    }
  }, 1000);
});

resetBtn.addEventListener('click', resetTimer);

inputElement.addEventListener('input', () => {
  const typedText = inputElement.value;
  displayColoredText(typedText);
});

function displayColoredText(typedText) {
  let coloredText = "";

  for (let i = 0; i < originalText.length; i++) {
    if (i < typedText.length) {
      if (typedText[i] === originalText[i]) {
        coloredText += `<span style="color: green;">${originalText[i]}</span>`;
      } else {
        coloredText += `<span style="color: red;">${originalText[i]}</span>`;
      }
    } else {
      coloredText += `<span>${originalText[i]}</span>`;
    }
  }

  textElement.innerHTML = coloredText;
}

function calculateResults() {
  const typedText = inputElement.value.trim();
  const typedWords = typedText.split(' ');
  wordsTyped = typedWords.length;

  const originalWords = originalText.split(' ');
  wordsCorrect = 0;

  typedWords.forEach((word, index) => {
    if (word === originalWords[index]) {
      wordsCorrect++;
    }
  });

  const accuracy = (wordsCorrect / wordsTyped) * 100;
  const wpm = (wordsTyped / 30) * 60; // Words per minute calculated based on 30 seconds

  // Display the results
  wordsTypedElement.textContent = `Words Typed: ${wordsTyped}`;
  wordsCorrectElement.textContent = `Words Correct: ${wordsCorrect}`;
  accuracyElement.textContent = `Accuracy: ${accuracy.toFixed(2)}%`;
  wpmElement.textContent = `WPM: ${wpm.toFixed(2)}`;
}

function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = 30; // reset to 30 seconds
  timer.textContent = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;
  inputElement.value = '';
  displayColoredText(""); // Reset the text display
  inputElement.disabled = true;
  wordsTypedElement.textContent = '';
  wordsCorrectElement.textContent = '';
  accuracyElement.textContent = '';
  wpmElement.textContent = '';
}
