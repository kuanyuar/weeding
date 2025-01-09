// Firebase 配置
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 問題邏輯
let currentQuestionIndex = 1;

// 加載問題
function loadQuestion(index) {
  const questionRef = db.ref(`questions/${index}`);
  questionRef.once("value", (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      displayQuestion(data);
    } else {
      document.getElementById("question").innerText = "問答結束！感謝您的參與！";
      document.getElementById("options").innerHTML = "";
    }
  });
}

// 顯示問題
function displayQuestion(data) {
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");

  questionElement.innerText = data.question;
  optionsElement.innerHTML = "";

  data.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.onclick = () => checkAnswer(index + 1, data.correct);
    optionsElement.appendChild(button);
  });
}

// 驗證答案
function checkAnswer(selected, correct) {
  const optionsElement = document.getElementById("options");
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

