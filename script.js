const startBtn = document.getElementById('start-btn');
const inputBox = document.getElementById('input-box');
const wordDisplay = document.getElementById('word-display');
const progressBar = document.getElementById('progress-bar');
const timeDisplay = document.getElementById('time-display');
const gameMessage = document.getElementById('game-message'); // メッセージを表示する要素

let words = [
    'ごはん', 'おにぎり', 'すし', 'もち', 'とーすと', 'うどん', 'そば', 'らーめん', 'すぱげってぃ', 'かれーらいす',
    'おむらいす', 'ちらしずし', 'はんばーがー', 'ほっとどっぐ', 'さんどいっち', 'ぴざ', 'ぎょうざ', 'たこやき',
    'めだまやき', 'さしみ', 'やきざかな', 'はんばーぐ', 'ころっけ', 'えびふらい', 'さらだ', 'みそしる',
    'くりーむしちゅー', 'すーぷ', 'ぎゅうにゅう', 'じゅーす', 'おちゃ', 'せんべい', 'だんご', 'さくらもち',
    'きゃんでぃー', 'ちょこれーと', 'ぷりん', 'ほっとけーき', 'ぱふぇ', 'けーき'
];
let currentWord = '';
let timeLeft = 60;  // プレイ時間を60秒に設定
let interval;
let progress = 0;  // ゲージの進行度
let gameStarted = false;  // ゲームが開始されたかどうかを管理

// スタートボタンを押した時の処理
startBtn.addEventListener('click', () => {
    gameMessage.textContent = '';  // メッセージをリセット
    wordDisplay.textContent = 'スペースキーを押して開始！';
    inputBox.disabled = true;  // ゲームが始まるまで入力を無効化
    document.addEventListener('keydown', startGameWithSpace);  // キーボードイベントを監視
});

// スペースキーが押されたらゲームを開始
function startGameWithSpace(event) {
    if (event.code === 'Space' && !gameStarted) {  // スペースキーが押された場合
        gameStarted = true;  // ゲーム開始状態にする
        inputBox.disabled = false;  // 入力ボックスを有効化
        inputBox.focus();  // 入力ボックスにフォーカス
        startGame();  // ゲームを開始
        document.removeEventListener('keydown', startGameWithSpace);  // イベントリスナーを解除
    }
}

// ゲーム開始処理
function startGame() {
    progress = 0;
    timeLeft = 60;  // 60秒にリセット
    inputBox.value = '';  // 入力欄をリセット
    updateProgress(0);  // ゲージの初期化
    generateWord();  // 最初の単語を表示
    startTimer();  // タイマーを開始
}

// タイマーを開始する関数
function startTimer() {
    clearInterval(interval);
    interval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimeDisplay();
        } else {
            endGame('時間切れ！');
        }
    }, 1000);
}

// 単語を生成する関数
function generateWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordDisplay.textContent = currentWord;
}

// プログレスバーを更新する関数
function updateProgress(amount) {
    progress += amount;
    if (progress >= 100) {
        resetProgress();  // ゲージが100%に達したらリセット
        increaseTime();   // 時間を増やす
    } else {
        progressBar.style.width = `${progress}%`;
    }
}

// ゲージのリセットと更新
function resetProgress() {
    progress = 0;
    progressBar.style.width = `${progress}%`;
}

// 時間を増加する関数
function increaseTime() {
    if (timeLeft <= 10) {
        timeLeft += 1;  // 10秒以下なら1秒増加
    } else if (timeLeft <= 15) {
        timeLeft += 5;  // 15秒以下なら5秒増加
    } else {
        timeLeft += 10; // それ以上なら10秒増加
    }
    updateTimeDisplay();
}

// タイム表示を更新する関数
function updateTimeDisplay() {
    timeDisplay.textContent = `残り時間: ${timeLeft}秒`;
}

// 入力を監視するイベントリスナー
inputBox.addEventListener('input', () => {
    const inputText = inputBox.value.trim();  // 空白を無視するために trim() を使用
    if (inputText === currentWord) {
        inputBox.value = '';  // 入力欄をリセット
        generateWord();  // 新しい単語を表示
        updateProgress(20);  // 正しい入力でゲージを20%進める
    }
});

// ゲーム終了処理
function endGame(message) {
    clearInterval(interval);  // タイマーを止める
    inputBox.disabled = true;  // 入力ボックスを無効化
    gameMessage.textContent = message;  // 画面に「時間切れ！」を表示
}
// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let players = {};

io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);
    
    // 新しいプレイヤーが参加したときの処理
    players[socket.id] = { score: 0 };
    
    // クライアントからの入力データを受け取る
    socket.on('wordTyped', (data) => {
        players[socket.id].score += data.score;
        // 対戦相手にもスコアを送信
        socket.broadcast.emit('updateScore', { id: socket.id, score: players[socket.id].score });
    });

    // プレイヤーが切断した場合
    socket.on('disconnect', () => {
        delete players[socket.id];
        console.log('user disconnected: ' + socket.id);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
