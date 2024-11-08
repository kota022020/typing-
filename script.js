const startBtn = document.getElementById('start-btn');
const inputBox = document.getElementById('input-box');
const wordDisplay = document.getElementById('word-display');
const progressBar = document.getElementById('progress-bar');
const timeDisplay = document.getElementById('time-display');
const gameMessage = document.getElementById('game-message');

// 日本語の単語を複数のローマ字に変換するための辞書（複数の入力パターンに対応）
const romajiDictionary = {
    'ハレー彗星': ['hare-suisei', 'halesuisei'],
    '日本文化': ['nihonbunka', 'nipponbunka'],
    '伝統料理': ['dentouryouri', 'dentouryori', 'dentouriyori', 'dentouriyouri'],
    '美味しい寿司': ['oishiisushi', 'oisiisusi', 'oishiisusi', 'oisiisushi'],
    '宇宙旅行': ['uchuuryokou', 'utyuuryokou', 'uchuuryoko', 'utyuuryoko'],
    '科学技術': ['kagakugijutsu', 'kagakugizyutu', 'kagakugizyutsu', 'kagakugijutu'],
    '温泉旅行': ['onsenryokou', 'onsennryokou', 'onsenryoko', 'onsennryoko'],
    '花火大会': ['hanabitaikai', 'hanabitaikai'],
    '動物園': ['doubutsuen', 'dobutuen', 'doubutuen', 'dobutsuen'],
    'テーマパーク': ['teemapaku', 'teemapa-ku', 'temapaku', 'temapa-ku'],
    '美味しいカレー': ['oishiikaree', 'oisiikare-', 'oishiikare-', 'oisiikaree'],
    '和風のお弁当': ['wafuunoobentou', 'wafuunoobento', 'wafuunobentou', 'wafuunobento'],
    '日帰り温泉': ['higaerionsen', 'higaeri-onsen'],
    '野生動物保護': ['yaseidoubutsuhogo', 'yaseidoubutuhogo', 'yaseidoubutsuhogo', 'yaseidobutuhogo'],
    '洋風のサラダ': ['youfuunosarada', 'youfuno-salada', 'youfunosalada'],
    '宇宙科学博物館': ['uchuukagakuhakubutsukan', 'utyuukagakuhakubutukan', 'uchu-kagakuhakubutsukan', 'utyu-kagakuhakubutsukan'],
    'フランス料理': ['furansuryouri', 'huransuryouri', 'furansuryori', 'huransuryori'],
    '外国語の勉強': ['gaikokugonobenkyou', 'gaikokugonobenkyoo', 'gaikokugonobennkyou', 'gaikokugonobennkyoo'],
    'インターネット': ['intaanetto', 'intaaneto', 'intaanetuto'],
    '伝統的な祭り': ['dentoutekinamatsuri','denntoutekinamatsuri','dentoutekinamaturi','denntoutekinamaturi'],
    '日本の歴史文化': ['nihonnorekishibunka', 'nipponnorekishibunka'],
    '寿司を食べる時間': ['sushiwoTaberujikan', 'susiwotaberujikan', 'sushiwoTaberuzikan', 'susiwotaberuzikan'],
    '観光名所を訪れる': ['kankoumeishowootsureru', 'kannkoumeisyowootsureru', 'kankomeisyootsureru', 'kankoumeisyootsureru'],
    '日本料理を楽しむ': ['nihonryouriotanoshimu', 'nipponryouriotanoshimu', 'nipponryoriotanoshimu'],
    '科学者の研究発表': ['kagakushanokenkyuuhappyou', 'kagakushanokenkyuhappyou', 'kagakusyanokenkyuhappyou', 'kagakusyanokenkyuuhappyo'],
    '新しい技術革新': ['atarashiigijutsukakushin', 'atarashiigizyutukakusin', 'atarasiigijyutukakushin'],
    '星空を観察する': ['hoshizoraokansatsusuru', 'hosizoraokannsatsusuru', 'hosizorakansatsusuru', 'hoshizorakannsatsusuru'],
    '美しい風景写真': ['utsukushiifuukeishashin', 'utukushiifu-keisyasin', 'utsukushiifu-keisyashin', 'utukushiifu-keisasyasin']
};


// 単語リストを文字数ごとに設定（ローマ字と日本語表示用）
const wordDictionary = {
    9: ['ハレー彗星', '日本文化', '伝統料理', '美味しい寿司', '宇宙旅行', '科学技術', '温泉旅行', '花火大会', '動物園', 'テーマパーク'],
    10: ['美味しいカレー', '和風のお弁当', '日帰り温泉', '野生動物保護', '洋風のサラダ', '宇宙科学博物館', 'フランス料理', '外国語の勉強', 'インターネット'],
    11: ['伝統的な祭り', '日本の歴史文化', '寿司を食べる時間', '観光名所を訪れる', '日本料理を楽しむ', '科学者の研究発表', '新しい技術革新', '星空を観察する', '美しい風景写真'],
    12: ['フランス料理の食事', '伝統的な和食料理', '季節の花々を観賞', '科学者の大発見', '宇宙の謎を解明する', '観光地を巡る旅行', '宇宙飛行士の冒険'],
    13: ['日本の四季を楽しむ', '美しい景色を撮影する', '伝統的な祭りに参加', '日本の芸術を学ぶ', '歴史的な遺産を訪問する', '伝統的な和食を楽しむ', '美味しい洋食を作る'],
    14: ['科学技術の進歩を研究', '宇宙の謎を解明する研究', '伝統文化を学ぶ機会を増やす', 'フランス料理を本格的に作る', '日本の美しい自然を体験する']
};

let currentWord = '';
let currentRomajiList = [];  // ローマ字の正解リスト
let currentLevel = 9;  // 初期レベルは9文字
let completedWords = [];  // すでにクリアした単語
let timeLeft = 60;     // プレイ時間を60秒に設定
let interval;
let progress = 0;      // ゲージの進行度
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
    currentLevel = 9;  // 初期レベルは9文字
    completedWords = [];  // クリアした単語をリセット
    timeLeft = 60;   // 60秒にリセット
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
    const wordList = wordDictionary[currentLevel].filter(word => !completedWords.includes(word));  // 未入力の単語のみ表示
    if (wordList.length === 0) {
        levelUp();  // すべての単語がクリアされたらレベルアップ
    } else {
        currentWord = wordList[Math.floor(Math.random() * wordList.length)];
        currentRomajiList = romajiDictionary[currentWord];  // 複数のローマ字表記を取得
        wordDisplay.textContent = currentWord;  // 日本語でお題を表示
    }
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

// 時間を増加する関数（レベルごとに増加時間を変える）
function increaseTime() {
    if (currentLevel <= 10) {
        timeLeft += 5;  // 9～10文字では5秒増加
    } else if (currentLevel <= 12) {
        timeLeft += 10;  // 11～12文字では10秒増加
    } else if
    (currentLevel <= 14) {
        timeLeft += 10;  // 13～14文字でも10秒増加
    }
    updateTimeDisplay();
}

// タイム表示を更新する関数
function updateTimeDisplay() {
    timeDisplay.textContent = `残り時間: ${timeLeft}秒`;
}

// 入力を監視するイベントリスナー
inputBox.addEventListener('input', () => {
    const inputText = inputBox.value.trim().toLowerCase();  // 入力をローマ字で小文字に変換して判定
    if (currentRomajiList.some(romaji => romaji === inputText)) {  // 入力されたローマ字が複数の候補のいずれかと一致するかを判定
        completedWords.push(currentWord);  // クリア済み単語リストに追加
        inputBox.value = '';  // 入力欄をリセット
        updateProgress(20);  // 正しい入力でゲージを20%進める
        generateWord();  // 新しい単語を表示
    }
});

// レベルアップを実行する関数
function levelUp() {
    if (currentLevel < 14) {
        currentLevel++;  // レベル（文字数）を1つ増やす
        completedWords = [];  // 新しいレベルに進むのでクリア済みリストをリセット
        gameMessage.textContent = `難易度アップ！${currentLevel}文字のお題が出ます。`;
        generateWord();  // 新しいレベルのお題を表示
    } else {
        gameMessage.textContent = 'すべてのレベルをクリアしました！おめでとう！';
        endGame('クリア！');
    }
}

// ゲーム終了処理
function endGame(message) {
    clearInterval(interval);  // タイマーを止める
    inputBox.disabled = true;  // 入力ボックスを無効化
    gameMessage.textContent = message;  // 画面に終了メッセージを表示
}
