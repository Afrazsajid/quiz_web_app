
function letterToNumber(letter) {
    return letter.toLowerCase().charCodeAt(0) - 96;
}

const quizContainer = document.querySelector('.quiz-container');
const questionText = document.querySelector('#question-text');
const options = document.querySelectorAll('.option-button');
const nextButton = document.querySelector('#next-button');
const backButton = document.querySelector('#back-button');
const resultsContainer = document.querySelector('.results-container');
const resultsList = document.querySelector('#results-list');

// API data example
let quizData

let currentQuestion = 0;
let score = 0;
let timer = 600; // 10 minutes in seconds

let slected_opt_id_lst = []


    // < button id = "option-a" class="option-button" > Option A</ >
    //                 <button id="option-b" class="option-button">Option B</button>
    //                 <button id="option-c" class="option-button">Option C</button>
    //                 <button id="option-d" class="option-button">Option D</button>

async function fetchQuestionData() {
    fetch("https://quizapi.io/api/v1/questions?apiKey=lV4E5MUmNEJi0wLlsoE1mupL1d84QeVUuYQcXni9&difficulty=Medium&limit=7&tags=HTML")
        .then(response => response.json())
        .then(data => {


            quizData = data;
            renderQuestion()
                //   onsole.log(quizData);
                ;
        })
        .catch(error => {
            console.error('Error:', error);
        });

}


function renderQuestion(attepmt = false) {


    const question = quizData[currentQuestion];
    questionText.textContent = question.question;
    let cont=document.getElementById("options_cont")
    Object.values(question.answers).forEach((option, index) => {
        
        cont.insertAdjacentHTML('beforeend', `<button id="${option}-${index}" class="{option-button}"></button>`);
        console.log(cont)
       let but_opt=cont.getElementsByTagName("button")[index]
       console.log(but_opt)
        but_opt.classList.remove('correct')
        but_opt.classList.remove('incorrect')
        but_opt.textContent = (option);
        //   console.log(Object.values(question.answers)[index])
        but_opt.id = `answer_${index + 1}`; // Set the ID of the option button
        ;
    });

}
// Function to handle option selection
function handleOptionSelection(event) {
    slected_opt_id_lst[currentQuestion] = (event.target.id)
    // console.log(currentQuestion)

    // console.log(slected_opt_id_lst)





    renderQuestion();
}


function renderResults() {
    const resultsHTML = quizData.map((question, index) => {
        const cor_ans_ind = question.correct_answer
        const correctAnswer = 'answer_' + letterToNumber(question.correct_answer.split('_')[1]);
        const userAnswer = slected_opt_id_lst[index];
        const resultClass = userAnswer === correctAnswer ? "green" : "red";
        return `
        <div class="result-item ${resultClass}">
          <p>Question : ${question.question}</p>
          <p>Your answer: ${document.getElementById(userAnswer).textContent}</p>
          <p>Correct answer: ${question.answers[cor_ans_ind]}</p>
        </div>
      `;
    }).join("");
    resultsList.innerHTML = resultsHTML;
    document.getElementById('restart').addEventListener('click', function (e) {
        // console.log("j")




        window.location.reload();
    });
}




function handleNextButtonClick(e) {
    // console.log("h")
    if ((currentQuestion < quizData.length - 1) && (slected_opt_id_lst.length > currentQuestion)) {
        currentQuestion++;
        renderQuestion()

    } else if (currentQuestion === quizData.length - 1) {

        document.querySelector(".results-container").classList.remove("no")

        renderResults();
    }

    if (currentQuestion > quizData.length - 2) {
        e.target.textContent = "check result"
    }
}


function handleBackButtonClick() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}




function startTimer() {
    setInterval(() => {
        timer--;
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        document.querySelector("#timer").textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        if (timer === 0) {
            alert("You are out of time! 😞");
            renderResults();
        }
    }, 1000);
}

// Initialize quiz
async function restart() {
    // console.log("h")

    const data = await fetchQuestionData();
    startTimer()
    if (data && data.length > 0) {
        quizData = data;
        // console.log(quizData); // Fix the typo here
        renderQuestion();
        ;
    } else {
        console.error('No data available');
    }



    // Add event listeners
    options.forEach((option) => {
        option.addEventListener("click", handleOptionSelection);
    });
    nextButton.addEventListener("click", handleNextButtonClick);
    backButton.addEventListener("click", handleBackButtonClick);
}

restart()


