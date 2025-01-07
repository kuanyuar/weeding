// Firebase 配置
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_DATABASE_NAME.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化 Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM 元素
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");

// 加載問題
let currentQuestionIndex = 1;

function loadQuestion(index) {
  const questionRef = ref(db, `questions/${index}`);
  get(questionRef).then(snapshot => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      displayQuestion(data);
    } else {
      questionElement.innerText = "問答結束！感謝您的參與！";
      optionsElement.innerHTML = "";
    }
  });
}

function displayQuestion(data) {
  questionElement.innerText = data.question;
  optionsElement.innerHTML = "";

  data.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.onclick = () => checkAnswer(index + 1, data.correct);
    optionsElement.appendChild(button);
  });
}

function checkAnswer(selected, correct) {
  const buttons = optionsElement.querySelectorAll("button");
  buttons.forEach((button, index) => {
    if (index + 1 === correct) button.classList.add("correct");
    if (index + 1 === selected && selected !== correct) button.classList.add("wrong");
    button.disabled = true;
  });

  setTimeout(() => {
    currentQuestionIndex++;
    loadQuestion(currentQuestionIndex);
  }, 2000);
}

// 啟動遊戲
loadQuestion(currentQuestionIndex);

