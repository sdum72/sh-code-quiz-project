
var questionsElement = document.querySelector("#questions");
var timerElement = document.querySelector("#time");
var answersElement = document.querySelector("#answers");
var submitBtn = document.querySelector("#submit");
var startBtn = document.querySelector("#start");
var initialsElement = document.querySelector("#initials");
var feedbackElement = document.querySelector("#feedback");

// quiz state variables
var currentQuestionIndex = 0;
var time = questions.length * 5;
var timerId;

function startQuiz() {
  // hide start screen
  var startScreenElement = document.getElementById("start-screen");
  startScreenElement.setAttribute("class", "hide");

  // un-hide questions section
  questionsElement.removeAttribute("class");

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerElement.textContent = time;

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  var titleElement = document.getElementById("question-title");
  titleElement.textContent = currentQuestion.question;

  // clear out any old question answers
  answersElement.innerHTML = "";

  // loop over answers
  currentQuestion.answers.forEach(function(choice, i) {
    // create new button for each choice
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;

    // attach click event listener to each choice
    choiceNode.onclick = questionClick;

    // display on the page
    answersElement.appendChild(choiceNode);
  });
}

function questionClick() {
  // check if user guessed wrong
  if (this.value !== questions[currentQuestionIndex].correctAnswer) {
    // penalize time
    time -= 5;

    if (time <= 0) {
      time = 0;
    }
    // display new time on page
    timerElement.textContent = time;
    feedbackElement.textContent = "Wrong!";
    feedbackElement.style.color = "red";
    feedbackElement.style.fontSize = "400%";
  } else {
    feedbackElement.textContent = "Correct!";
    feedbackElement.style.color = "green";
    feedbackElement.style.fontSize = "400%";
  }

  // flash right/wrong feedback
  feedbackElement.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackElement.setAttribute("class", "feedback hide");
  }, 1000);

  // next question
  currentQuestionIndex++;

  // time checker
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);

  // show end screen
  var endScreenElement = document.getElementById("end-screen");
  endScreenElement.removeAttribute("class");

  // show final score
  var finalScoreElement = document.getElementById("final-score");
  finalScoreElement.textContent = time;

  // hide questions section
  questionsElement.setAttribute("class", "hide");
}

function clockTick() {
  // update time
  time--;
  timerElement.textContent = time;

  // check if user ran out of time
  if (time < 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var initials = initialsElement.value.trim();

  if (initials !== "") {
    // get saved scores from localstorage, or if not any, set to empty array
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // redirect to next page
    window.location.href = "highscores.html";
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// submit initials
submitBtn.onclick = saveHighscore;

// start quiz
startBtn.onclick = startQuiz;

initialsElement.onkeyup = checkForEnter;
