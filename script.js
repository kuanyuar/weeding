// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyD10xAti8bA4liNUP7KRsKm_i4OhqnbDEA",
    authDomain: "weddingquiz-690e4.firebaseapp.com",
    databaseURL: "https://weddingquiz-690e4-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "weddingquiz-690e4",
    storageBucket: "weddingquiz-690e4.firebasestorage.app",
    messagingSenderId: "987305840417",
    appId: "1:987305840417:web:7c2ba93cc36c70953df860",
    measurementId: "G-YXQEL85Z4B"
  };

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 紀錄賓客回答狀況
const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`; // 自動生成唯一 ID
const guestName = prompt("請輸入您的名字：");

// 將賓客名字寫入資料庫
db.ref(`responses/${guestId}`).set({
  name: guestName,
  correct_count: 0,
  total_questions: 0,
  answers: {}
});

// 問題邏輯
let currentQuestionIndex = 1;

// 加載問題
function loadQuestion(index) {
  const questionRef = db.ref("questions");
questionRef.once("value", (snapshot) => {
  if (snapshot.exists()) {
    console.log("讀取到的所有問題：", snapshot.val());
  } else {
    console.log("問題節點不存在或數據加載失敗！");
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

// 驗證答案並更新記錄
function checkAnswer(selected, correct, questionId) {
  const isCorrect = selected === correct;
  const guestRef = db.ref(`responses/${guestId}`);

  // 更新回答記錄
  guestRef.child(`answers/${questionId}`).set({
    answer: selected,
    correct: isCorrect
  });

  // 更新正確數與總答題數
  guestRef.transaction((guestData) => {
    if (guestData) {
      guestData.total_questions = (guestData.total_questions || 0) + 1;
      if (isCorrect) {
        guestData.correct_count = (guestData.correct_count || 0) + 1;
      }
    }
    return guestData;
  });

  // 顯示正確與否
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

function updateLeaderboard() {
  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = "";

  // 從 Firebase 獲取所有賓客數據
  db.ref("responses").orderByChild("correct_count").once("value", (snapshot) => {
    const leaderboardData = [];
    snapshot.forEach((childSnapshot) => {
      const guestData = childSnapshot.val();
      leaderboardData.push({
        name: guestData.name,
        correct_count: guestData.correct_count || 0,
        total_questions: guestData.total_questions || 0
      });
    });

    // 排序排行榜（依照正確題數降序排列）
    leaderboardData.sort((a, b) => b.correct_count - a.correct_count);

    // 顯示排行榜
    leaderboardData.forEach((guest, index) => {
      const listItem = document.createElement("li");
      listItem.innerText = `${index + 1}. ${guest.name} - 答對 ${guest.correct_count}/${guest.total_questions}`;
      leaderboardList.appendChild(listItem);
    });
  });
}


// 啟動遊戲
loadQuestion(currentQuestionIndex);

// 每次問題完成後更新排行榜
setTimeout(() => {
  updateLeaderboard();
}, 3000);
