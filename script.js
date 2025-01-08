// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyD10xAti8bA4liNUP7KRsKm_i4OhqnbDEA",
    authDomain: "weddingquiz-690e4.firebaseapp.com",
    projectId: "weddingquiz-690e4",
    storageBucket: "weddingquiz-690e4.firebasestorage.app",
    messagingSenderId: "987305840417",
    appId: "1:987305840417:web:7c2ba93cc36c70953df860",
    measurementId: "G-YXQEL85Z4B"
  };

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 問題邏輯
let currentQuestionIndex = 1;

// 加載問題
function loadQuestion(index) {
  const questionRef = db.ref(`questions/${index}`);
  questionRef.get().then((snapshot) => {
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

// 開始遊戲
loadQuestion(currentQuestionIndex);

