function numberToLetter(num) {
  var alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return alphabet[num - 1];
}

function letterToNumber(letter) {
  return letter.toLowerCase().charCodeAt(0) - 96;
}

function escapeHtmlTags(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
const rootStyles = getComputedStyle(document.documentElement);
const btn_color = rootStyles.getPropertyValue('--color2')


const quizContainer = document.querySelector('.quiz-container');
const questionText = document.querySelector('#question-text');
const options = document.querySelectorAll('.option-button');
const nextButton = document.querySelector('#next-button');
const backButton = document.querySelector('#back-button');
const resultsContainer = document.querySelector('.results-container');
const resultsList = document.querySelector('#results-list');
const section = document.querySelector("#result_cont_down")

let result = false

// API data example
let quizData

let currentQuestion = 0;
let score = 0;

 // Timer variable for each question

let timer = 180; 

let slected_opt_id_lst = []


let selectedOptIdList = []

async function fetchQuestionData() {
  fetch('question.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      quizData = data;
      renderQuestion();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function renderQuestion() {
  const question = quizData[currentQuestion];
  questionText.textContent = question.question;
  options.forEach((option, index) => {
    option.classList.remove('clicked', 'correct', 'incorrect');
    option.classList.add('blue');

    option.textContent = Object.values(question.answers)[index];
    option.id = `answer_${index + 1}`;
  });
  startQuestionTimer();
}

function handleOptionSelection(event) {
  const selectedOption = event.target;
  const correctAnswer = quizData[currentQuestion].correct_answer;
  const correctAnswerId = 'answer_' + letterToNumber(correctAnswer.split('_')[1]);

  selectedOptIdList[currentQuestion] = selectedOption.id;

  options.forEach(option => {
    option.addEventListener('click', handleOptionSelection);

    if (option.id === correctAnswerId) {
      option.classList.add('correct');
    } else {
      option.classList.add('incorrect');
    }
  });

  selectedOption.classList.remove('blue')

  if (selectedOption.id === correctAnswerId) {
    selectedOption.classList.add('correct');
  } else {
    selectedOption.classList.add('incorrect');
  }

  clearInterval(timer);
}

function renderResults() {
  result = true;

  section.scrollIntoView({ behavior: 'smooth' });
  console.log(quizData)
  const resultsHTML = quizData.map((question, index) => {
    console.log(question)
    
    const correctAnswer = 'answer_' + letterToNumber(question.correct_answer.split('_')[1]);

    console.log(index)
    
    let userAnswer = selectedOptIdList[index];

    const resultClass = userAnswer === correctAnswer ? "green" : "red";
    userAnswer = userAnswer.replace(/_(\d+)/, function (match, number) {
      return "_" + numberToLetter(parseInt(number));
    });

    return `
        <div class="result-item ${resultClass}">
          <p>Question :<code>${escapeHtmlTags(question.question)}</code></p>
          <p>Your answer: <code>${escapeHtmlTags(question.answers[userAnswer])}</code></p>
          <p>Correct answer: <code>${escapeHtmlTags(question.answers[question.correct_answer])}</code></p>
        </div>
      `;
  }).join("");
  resultsList.innerHTML = resultsHTML;
  document.getElementById('restart').addEventListener('click', function () {
    window.location.reload();
  });
}

function handleNextButtonClick(e) {
  if ((currentQuestion < quizData.length - 1) && (selectedOptIdList.length > currentQuestion)) {
    currentQuestion++;
    renderQuestion();
  } else if (currentQuestion === quizData.length - 1) {
    document.querySelector(".results-container").classList.remove("no");
    renderResults();
  }

  if (currentQuestion > quizData.length - 2) {
    e.target.textContent = "check result";
  }
}

function handleBackButtonClick() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

function startQuestionTimer() {
  let timeLeft = 20; // 20 seconds per question
  document.querySelector("#timer").textContent = `${Math.floor(timeLeft / 60)}:${timeLeft % 60}`;

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      document.querySelector("#timer").textContent = `${Math.floor(timeLeft / 60)}:${timeLeft % 60}`;
    } else {
      clearInterval(timer);
      selectedOptIdList[currentQuestion] = 0
      Swal.fire({
        html: `<img src="https://c.tenor.com/1ApT-pZWryIAAAAC/tenor.gif" alt="Custom icon">`,
        title: "Time out",
        confirmButtonText: 'Next Question',
        confirmButtonColor: btn_color,
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        if (currentQuestion < quizData.length - 1) {
          currentQuestion++;
          renderQuestion();
        } else {
          renderResults();
        }
      });
    }
  }, 1000);
}

// Initialize quiz
async function restart() {
  const data = await fetchQuestionData();
  if (data && data.length > 0) {
    quizData = data;
    renderQuestion();
  } else {
    console.error('No data available');
  }

  options.forEach((option) => {
    option.addEventListener("click", handleOptionSelection);
  });
  nextButton.addEventListener("click", handleNextButtonClick);
  backButton.addEventListener("click", handleBackButtonClick);
}

restart();
