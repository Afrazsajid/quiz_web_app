
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
const section=document.querySelector("#result_cont_down")

// API data example
let quizData 
  
  let currentQuestion = 0;
  let score = 0;
  let timer = 10; // 10 minutes in seconds

  let slected_opt_id_lst=[]
  

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
  

function renderQuestion(attepmt=false) {


    const question = quizData[currentQuestion];
    questionText.textContent = question.question;
    options.forEach((option, index) => {
        option.classList.remove('clicked')

      option.textContent =(Object.values(question.answers)[index]);
    //   console.log(Object.values(question.answers)[index])
      option.id = `answer_${index + 1}`; // Set the ID of the option button
      
      ;
    });

  }
  // Function to handle option selection
  function handleOptionSelection(event) {
    slected_opt_id_lst[currentQuestion]=(event.target.id)
    renderQuestion()
    event.target.classList.toggle("clicked")
    // console.log(currentQuestion)
    
    // console.log(slected_opt_id_lst)
    
 



    ;
  }

  function renderResults() {

    section.scrollIntoView({ behavior: 'smooth' })
    const resultsHTML = quizData.map((question, index) => {
    const cor_ans_ind=question.correct_answer
    const correctAnswer = 'answer_' + letterToNumber(question.correct_answer.split('_')[1]);
      const userAnswer = slected_opt_id_lst[index];
      const resultClass = userAnswer === correctAnswer ? "green" : "red";
      return `
        <div class="result-item ${resultClass}">
          <>Question :<code>${escapeHtmlTags(question.question)}</code></p>
          <>Your answer: <code>${escapeHtmlTags(document.getElementById(userAnswer).textContent)}</code></p>
          <>Correct answer: <code>${escapeHtmlTags(question.answers[cor_ans_ind])}</code></p>
        </div>
      `;
    }).join("");
    resultsList.innerHTML = resultsHTML;
    document.getElementById('restart').addEventListener('click', function(e) {
        // console.log("j")
    
    
    
   
        window.location.reload(); 
      });
  }
  



  function handleNextButtonClick(e) {
    // console.log("h")
    if ((currentQuestion < quizData.length - 1) && (slected_opt_id_lst.length>currentQuestion)){
      currentQuestion++;
      renderQuestion()
    
    } else if(currentQuestion === quizData.length-1 ) {
        
        document.querySelector(".results-container").classList.remove("no")
        
      renderResults();
    }

    if (currentQuestion > quizData.length - 2){
        e.target.textContent="check result"
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
        Swal.fire({
        
          html: `<img src="https://c.tenor.com/1ApT-pZWryIAAAAC/tenor.gif" alt="Custom icon">`,
          title: "Time out",
          
          confirmButtonText: 'Try Again',
          confirmButtonColor: btn_color,

 
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload()
            
            
          } 
        });

        ;
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


