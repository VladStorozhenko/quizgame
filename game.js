const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('scoreText');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionScore = 0;
let availableQuestions = [];
// Constants
const CORRECT_BONUS = 1;

let MAX_QUESTIONS;

let questions = [];

fetch("questions.json")
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    console.log(loadedQuestions);
    questions = loadedQuestions;
    console.log(loadedQuestions.length);
    MAX_QUESTIONS = loadedQuestions.length;
    startGame();
  })
  .catch(err => {
    console.error(err);
  })



startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions]
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
}

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        // go to the end page
        return window.location.assign('/end.html');
    }
    questionCounter++;
    progressText.innerText = `Вопрос ${questionCounter}/${MAX_QUESTIONS}`;
    // update progress bar
    progressBarFull.style.width = questionCounter / (MAX_QUESTIONS + 1) * 100 + '%';
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) { return }
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        if(selectedAnswer == currentQuestion.answer) {
            setTimeout(() => {
                incrementScore(CORRECT_BONUS);
            }, 500);
        }

        selectedChoice.classList.add('chosen');
        setTimeout(() => {
            selectedChoice.classList.remove('chosen');
            getNewQuestion();
        }, 500);
    })
})

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}
