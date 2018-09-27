'use strict'

let questionCounter = 1;
let currentScore = 0;
let currentQuestion = '';

function handleScore(){
  $('.score-counter').text(currentScore);
};

function handleCounter(){
  $('.quiz-form').on('click', '#answers-selection button', function(event){
    event.preventDefault();
    questionCounter += 1;
  });  
};

// Hide start page on start button click
function removeStartPage(){
  $('.start-form').on('click', '.start-button', function(event){
    event.preventDefault();
    $('.start-form').hide(0, renderQuestionPage);
  });
};

// Shuffle answers selection each time through the quiz
function answersShuffle(randomAnswers){
    let length = randomAnswers.length;
    let temp;
    let index;
    
    while (length > 0) {
        index = Math.floor(Math.random() * length);
        length--;
        temp = randomAnswers[length];
        randomAnswers[length] = randomAnswers[index];
        randomAnswers[index] = temp;
    };
    return randomAnswers;
};

// Build each answer option from generateAnswers function
function generateAnswer(item, index){
    if (index === 0){
    return `<input type="radio" name="user-answer" id="${index}" value="${item}" checked required> 
            <label for="${index}"><span>${item}</span></label>
            <br>`
    } else {
      return `<input type="radio" name="user-answer" id="${index}" value="${item}"> 
            <label for="${index}"><span>${item}</span></label>
            <br>`
    };

};

// Access QUESTION database for next question/answer set
function generateAnswers(item) {
    let answers = answersShuffle(item.answers);
    return answers.map((a, index) => generateAnswer(a, index)).join('')
};

// Render html for renderQuestionPage
function generateQuizQuestion(item){
  return `
        <div class="js-quiz-container">
          <form id="answers-selection" role="form">
          <fieldset>
          <legend class="question">${item.question}</legend>
            ${generateAnswers(item)}
          </fieldset>
          <button type="submit">Answer</button>
          </form>
        </div>`
};

// Display next question/answer set
function renderQuestionPage(){
  currentQuestion = QUESTIONS[`${questionCounter - 1}`];
  $('.quiz-form').html(generateQuizQuestion(currentQuestion));
  $('.question-counter').text(questionCounter);
};

// Render feedback html, depending on correct or incorrect answer selection
function generateFeedback(answerCheck){
  if (answerCheck === currentQuestion.correctAnswer){
    currentScore++;
    handleScore();
    return `
      <div class="col-8 js-quiz-container">  
        <div class="correct-answer">
          <form id="answer-form" role="form">
            <fieldset>
            <legend>Great Job!</legend>
            <img src="Images/llama.jpeg" alt="An icon of a llama"/>
          <a href="${currentQuestion.learnMore}" target="_blank">Learn More</a>
            </fieldset>
            <button type="submit" class="next-question">Next</button>
          </form>
        </div>
      </div>`
  } else {
    return `
      <div class="col-8 js-quiz-container">  
        <div class="incorrect-answer">
          <form id="answer-form" role="form">
          <fieldset>
          <legend>Incorrect</legend>
          The correct answer is ${currentQuestion.correctAnswer}
          <img src="Images/condor.png" alt="An icon of a condor"/>
          <a href="${currentQuestion.learnMore}" target="_blank">Learn More</a>
            </fieldset>
            <button type="submit" class="next-question">Next</button>
          </form>
        </div>
      </div>`
  };
};

// Check for final question in QUESTION database
function finalQuestionCheck(){
  if (questionCounter > QUESTIONS.length) {
    $('.next-question').replaceWith(`<button type="submit" class="results">Results</button>`);
    $('.results').on('click', function(event){
      renderResultsPage();
    });
  };
};

// Move to the next question of quiz after checking on final question
function nextQuestion(){
  finalQuestionCheck();
  $('.next-question').on('click', function(event){
    event.preventDefault();
    renderQuestionPage();
  });
};

// Display feedback page, telling user if their selection is correct or incorrect
function renderFeedbackPage(){
  $('.quiz-form').on('click', '#answers-selection button', function(event){
    event.preventDefault();
    $('.quiz-form').html(generateFeedback($('input[name=user-answer]:checked').val()));
    nextQuestion();
  });
};

// Render html for results page
function generateResults(){
  return `
    <div class="col-8 js-quiz-container">  
      <div class="results-page">
        <form id="results-form" role="form">
          <fieldset>
          <legend>Results</legend>
          <img src="Images/machupicchu.jpg" alt="A picture of Machu Picchu"/>
          You got ${currentScore} correct,   ${(currentScore/QUESTIONS.length)*100}%.
          </fieldset>
          <button type="submit" class="results">Retake</button>
        </form>
      </div>
    </div>` 
};

// Display results page
function renderResultsPage(){
    $('.quiz-form').html(generateResults());
};

// Handle results button for retaking quiz
function retakeQuiz(){
  $('.quiz-form').on('click', 'button results', function(event){
    handleQuizApp();
  });
};

function handleQuizApp(){
    handleScore();
    handleCounter();
    removeStartPage();
    renderFeedbackPage();
};

$(handleQuizApp);