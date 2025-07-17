// Card expansion logic
let isCollapsing = false;

function collapseAllCards() {
  if (isCollapsing) return;
  isCollapsing = true;
  const grid = document.querySelector(".quiz-grid");
  const cards = document.querySelectorAll(".quiz-card");
  grid.classList.add("collapsing");
  cards.forEach((card) => {
    card.classList.remove("expanded");
    card.classList.remove("restored");
    const gameContent = card.querySelector(".game-content");
    gameContent.classList.add("collapsing");
    card.style.display = "none"; // Hide initially for animation
  });
  setTimeout(() => {
    cards.forEach((card) => {
      card.querySelector(".game-content").style.display = "none";
      card.querySelector(".game-content").classList.remove("collapsing");
      card.style.display = "flex";
      card.classList.add("restored");
    });
    grid.classList.remove("collapsing");
    grid.classList.add("restoring");
    setTimeout(() => {
      grid.classList.remove("restoring");
      grid.classList.add("restored");
      isCollapsing = false;
    }, 600); // Match CSS transition duration
  }, 600); // Match CSS transition duration
}

document.querySelectorAll(".quiz-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (isCollapsing || card.classList.contains("expanded")) return;
    collapseAllCards();
    setTimeout(() => {
      card.classList.add("expanded");
      card.querySelector(".game-content").style.display = "block";
      const game = card.dataset.game;
      if (game === "mc") loadMCQuestion();
      else if (game === "tf") loadTFQuestion();
      else if (game === "match") loadMatchGame();
      else if (game === "stmt") loadStmtQuestion();
    }, 600); // Delay to allow collapse animation
  });
});

// Multiple-Choice Quiz
const mcQuestions = [
  {
    question: "Which extraction method is used at Namibia’s Langer Heinrich?",
    options: ["ISL", "Open-Pit", "Underground", "Heap Leaching"],
    answer: "ISL",
  },
  {
    question: "What percentage of global uranium does Namibia supply?",
    options: ["5%", "11%", "20%", "25%"],
    answer: "11%",
  },
  {
    question: "Which deposit type is ideal for ISL?",
    options: ["Granite", "Sandstone", "Breccia", "Quartz-Pebble"],
    answer: "Sandstone",
  },
  {
    question: "What is a key advantage of underground mining?",
    options: [
      "Low cost",
      "High production",
      "Less surface disruption",
      "Simple process",
    ],
    answer: "Less surface disruption",
  },
  {
    question: "What is uranium processed into for reactors?",
    options: ["UO₂", "U₃O₈", "U-235", "U-238"],
    answer: "U₃O₈",
  },
];

let mcCurrentQuestion = 0;
let mcScore = 0;

function loadMCQuestion() {
  const q = mcQuestions[mcCurrentQuestion];
  document.getElementById("mc-progress").innerText = `Question ${
    mcCurrentQuestion + 1
  }/${mcQuestions.length}`;
  document.getElementById("mc-question").innerText = q.question;
  const optionsDiv = document.getElementById("mc-options");
  optionsDiv.innerHTML = "";
  q.options.forEach((option, index) => {
    optionsDiv.innerHTML += `
      <div class="mc-option">
        <input type="radio" name="mc-option-${mcCurrentQuestion}" id="option${index}" value="${option}">
        <label for="option${index}">${option}</label>
      </div>
    `;
  });
  document.getElementById("mc-feedback").innerText = "";
  document.getElementById("mc-submit").style.display = "block";
  document.getElementById("mc-score").style.display = "none";
  document.getElementById("mc-retry").style.display = "none";
  document.getElementById("mc-end").style.display = "none";
}

document.getElementById("mc-submit").addEventListener("click", (e) => {
  e.stopPropagation();
  const selected = document.querySelector(
    `input[name="mc-option-${mcCurrentQuestion}"]:checked`
  );
  if (!selected) {
    document.getElementById("mc-feedback").innerText =
      "Please select an answer!";
    return;
  }
  const answer = selected.value;
  if (answer === mcQuestions[mcCurrentQuestion].answer) {
    mcScore++;
    document.getElementById("mc-feedback").innerText = "Correct!";
  } else {
    document.getElementById(
      "mc-feedback"
    ).innerText = `Incorrect! The answer is ${mcQuestions[mcCurrentQuestion].answer}.`;
  }
  mcCurrentQuestion++;
  if (mcCurrentQuestion < mcQuestions.length) {
    setTimeout(loadMCQuestion, 1000);
  } else {
    document.getElementById("mc-progress").innerText = "";
    document.getElementById("mc-question").innerText = "";
    document.getElementById("mc-options").innerHTML = "";
    document.getElementById("mc-submit").style.display = "none";
    document.getElementById("mc-score").style.display = "block";
    document.getElementById("mc-score").innerText = `Score: ${mcScore}/${
      mcQuestions.length
    } (${((mcScore / mcQuestions.length) * 100).toFixed(0)}%)`;
    document.getElementById("mc-retry").style.display = "inline-block";
    document.getElementById("mc-end").style.display = "inline-block";
  }
});

document.getElementById("mc-retry").addEventListener("click", (e) => {
  e.stopPropagation();
  mcCurrentQuestion = 0;
  mcScore = 0;
  loadMCQuestion();
});

document.getElementById("mc-end").addEventListener("click", (e) => {
  e.stopPropagation();
  collapseAllCards();
});

// True/False Game
const tfQuestions = [
  {
    question: "In-situ Leaching (ISL) has minimal surface disruption.",
    answer: true,
  },
  { question: "Open-pit mining produces minimal waste rock.", answer: false },
  { question: "Workers wear dosimeters to monitor radiation.", answer: true },
  {
    question: "Heap leaching has no risk of groundwater contamination.",
    answer: false,
  },
  { question: "Namibia’s uranium supports its economy.", answer: true },
];

let tfCurrentQuestion = 0;
let tfScore = 0;

function loadTFQuestion() {
  document.getElementById("tf-progress").innerText = `Question ${
    tfCurrentQuestion + 1
  }/${tfQuestions.length}`;
  document.getElementById("tf-question").innerText =
    tfQuestions[tfCurrentQuestion].question;
  document.getElementById("tf-feedback").innerText = "";
  document.getElementById("tf-true").style.display = "inline-block";
  document.getElementById("tf-false").style.display = "inline-block";
  document.getElementById("tf-score").style.display = "none";
  document.getElementById("tf-retry").style.display = "none";
  document.getElementById("tf-end").style.display = "none";
}

document.getElementById("tf-true").addEventListener("click", (e) => {
  e.stopPropagation();
  checkTFAnswer(true);
});

document.getElementById("tf-false").addEventListener("click", (e) => {
  e.stopPropagation();
  checkTFAnswer(false);
});

function checkTFAnswer(userAnswer) {
  const correct = tfQuestions[tfCurrentQuestion].answer;
  if (userAnswer === correct) {
    tfScore++;
    document.getElementById("tf-feedback").innerText = "Correct!";
  } else {
    document.getElementById(
      "tf-feedback"
    ).innerText = `Incorrect! The statement is ${correct}.`;
  }
  tfCurrentQuestion++;
  if (tfCurrentQuestion < tfQuestions.length) {
    setTimeout(loadTFQuestion, 1000);
  } else {
    document.getElementById("tf-progress").innerText = "";
    document.getElementById("tf-question").innerText = "";
    document.getElementById("tf-true").style.display = "none";
    document.getElementById("tf-false").style.display = "none";
    document.getElementById("tf-score").style.display = "block";
    document.getElementById("tf-score").innerText = `Score: ${tfScore}/${
      tfQuestions.length
    } (${((tfScore / tfQuestions.length) * 100).toFixed(0)}%)`;
    document.getElementById("tf-retry").style.display = "inline-block";
    document.getElementById("tf-end").style.display = "inline-block";
  }
}

document.getElementById("tf-retry").addEventListener("click", (e) => {
  e.stopPropagation();
  tfCurrentQuestion = 0;
  tfScore = 0;
  loadTFQuestion();
});

document.getElementById("tf-end").addEventListener("click", (e) => {
  e.stopPropagation();
  collapseAllCards();
});

// Matching Game
const matchItems = [
  {
    method: "ISL",
    description: "Minimal surface disruption, used at Langer Heinrich",
  },
  { method: "Open-Pit", description: "High production, used at Rössing" },
  {
    method: "Underground",
    description: "Suits deep deposits, less surface impact",
  },
  {
    method: "Heap Leaching",
    description: "Low-cost for low-grade ores, used in Australia",
  },
];

let selectedMethod = null;
let selectedDescription = null;
let matchPairs = [];
let matchScore = 0;

function loadMatchGame() {
  matchPairs = [];
  matchScore = 0;
  const shuffledMethods = [...matchItems].sort(() => Math.random() - 0.5);
  const shuffledDescriptions = [...matchItems].sort(() => Math.random() - 0.5);
  const methodsDiv = document.getElementById("match-methods");
  const descriptionsDiv = document.getElementById("match-descriptions");
  methodsDiv.innerHTML = "";
  descriptionsDiv.innerHTML = "";
  shuffledMethods.forEach((item) => {
    methodsDiv.innerHTML += `<div class="match-item method" data-value="${item.method}">${item.method}</div>`;
  });
  shuffledDescriptions.forEach((item) => {
    descriptionsDiv.innerHTML += `<div class="match-item description" data-value="${item.description}">${item.description}</div>`;
  });
  document.getElementById(
    "match-progress"
  ).innerText = `Matches ${matchPairs.length}/${matchItems.length}`;
  document.getElementById("match-feedback").innerText = "";
  document.getElementById("match-submit").style.display = "block";
  document.getElementById("match-score").style.display = "none";
  document.getElementById("match-retry").style.display = "none";
  document.getElementById("match-end").style.display = "none";

  document.querySelectorAll(".match-item.method").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      selectMatchItem(item, "method");
    });
  });
  document.querySelectorAll(".match-item.description").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      selectMatchItem(item, "description");
    });
  });
}

function selectMatchItem(item, type) {
  item.classList.add("selected");
  if (type === "method") {
    if (selectedMethod) selectedMethod.classList.remove("selected");
    selectedMethod = item;
  } else {
    if (selectedDescription) selectedDescription.classList.remove("selected");
    selectedDescription = item;
  }
  if (selectedMethod && selectedDescription) {
    matchPairs.push({
      method: selectedMethod.dataset.value,
      description: selectedDescription.dataset.value,
    });
    selectedMethod.style.display = "none";
    selectedDescription.style.display = "none";
    selectedMethod.classList.remove("selected");
    selectedDescription.classList.remove("selected");
    selectedMethod = null;
    selectedDescription = null;
    document.getElementById(
      "match-progress"
    ).innerText = `Matches ${matchPairs.length}/${matchItems.length}`;
  }
}

document.getElementById("match-submit").addEventListener("click", (e) => {
  e.stopPropagation();
  matchScore = 0;
  matchPairs.forEach((pair) => {
    const correct = matchItems.find(
      (item) =>
        item.method === pair.method && item.description === pair.description
    );
    if (correct) matchScore++;
  });
  document.getElementById("match-progress").innerText = "";
  document.getElementById("match-methods").innerHTML = "";
  document.getElementById("match-descriptions").innerHTML = "";
  document.getElementById("match-submit").style.display = "none";
  document.getElementById("match-score").style.display = "block";
  document.getElementById("match-score").innerText = `Score: ${matchScore}/${
    matchItems.length
  } (${((matchScore / matchItems.length) * 100).toFixed(0)}%)`;
  document.getElementById("match-retry").style.display = "inline-block";
  document.getElementById("match-end").style.display = "inline-block";
});

document.getElementById("match-retry").addEventListener("click", (e) => {
  e.stopPropagation();
  loadMatchGame();
});

document.getElementById("match-end").addEventListener("click", (e) => {
  e.stopPropagation();
  collapseAllCards();
});

// Statement Quiz
const stmtQuestions = [
  {
    question:
      "Name the primary uranium extraction method used at Namibia’s Langer Heinrich.",
    answers: ["ISL", "In-situ Leaching", "In situ Leaching"],
  },
  {
    question: "What is the processed form of uranium used in nuclear reactors?",
    answers: ["U₃O₈", "U3O8", "Uranium Oxide"],
  },
  {
    question: "Name one major uranium mine in Namibia besides Langer Heinrich.",
    answers: ["Rössing", "Rossing", "Husab"],
  },
  {
    question: "What type of deposit is ideal for In-situ Leaching?",
    answers: ["Sandstone"],
  },
  {
    question: "Name one worker safety practice used in uranium mining.",
    answers: [
      "Dosimeters",
      "PPE",
      "Ventilation",
      "Protective Clothing",
      "Respirators",
    ],
  },
];

let stmtCurrentQuestion = 0;
let stmtScore = 0;

function loadStmtQuestion() {
  document.getElementById("stmt-progress").innerText = `Question ${
    stmtCurrentQuestion + 1
  }/${stmtQuestions.length}`;
  document.getElementById("stmt-question").innerText =
    stmtQuestions[stmtCurrentQuestion].question;
  document.getElementById("stmt-answer").value = "";
  document.getElementById("stmt-feedback").innerText = "";
  document.getElementById("stmt-submit").style.display = "block";
  document.getElementById("stmt-score").style.display = "none";
  document.getElementById("stmt-retry").style.display = "none";
  document.getElementById("stmt-end").style.display = "none";
  document.getElementById("stmt-answer").style.display = "block";
}

document.getElementById("stmt-submit").addEventListener("click", (e) => {
  e.stopPropagation();
  const answer = document
    .getElementById("stmt-answer")
    .value.trim()
    .toLowerCase();
  if (!answer) {
    document.getElementById("stmt-feedback").innerText =
      "Please enter an answer!";
    return;
  }
  const correctAnswers = stmtQuestions[stmtCurrentQuestion].answers.map((a) =>
    a.toLowerCase()
  );
  if (correctAnswers.includes(answer)) {
    stmtScore++;
    document.getElementById("stmt-feedback").innerText = "Correct!";
  } else {
    document.getElementById(
      "stmt-feedback"
    ).innerText = `Incorrect! A correct answer is ${stmtQuestions[stmtCurrentQuestion].answers[0]}.`;
  }
  stmtCurrentQuestion++;
  if (stmtCurrentQuestion < stmtQuestions.length) {
    setTimeout(loadStmtQuestion, 1000);
  } else {
    document.getElementById("stmt-progress").innerText = "";
    document.getElementById("stmt-question").innerText = "";
    document.getElementById("stmt-answer").style.display = "none";
    document.getElementById("stmt-submit").style.display = "none";
    document.getElementById("stmt-score").style.display = "block";
    document.getElementById("stmt-score").innerText = `Score: ${stmtScore}/${
      stmtQuestions.length
    } (${((stmtScore / stmtQuestions.length) * 100).toFixed(0)}%)`;
    document.getElementById("stmt-retry").style.display = "inline-block";
    document.getElementById("stmt-end").style.display = "inline-block";
  }
});

document.getElementById("stmt-retry").addEventListener("click", (e) => {
  e.stopPropagation();
  stmtCurrentQuestion = 0;
  stmtScore = 0;
  document.getElementById("stmt-answer").style.display = "block";
  loadStmtQuestion();
});

document.getElementById("stmt-end").addEventListener("click", (e) => {
  e.stopPropagation();
  collapseAllCards();
});

// Initialize first game
collapseAllCards();
