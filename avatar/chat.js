const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const historyButton = document.getElementById('history-button');
const historyModal = document.getElementById('history-modal');
const historyMessages = document.getElementById('history-messages');
const closeHistoryButton = document.getElementById('close-history');
const voiceButton = document.getElementById('voice-button');
let maleVoice = null;
let recognition;

function getMaleVoice() {
    const voices = window.speechSynthesis.getVoices();
    maleVoice = voices.find(voice => voice.name.includes('Male') || voice.name.includes('мужской'));
    if (!maleVoice) {
        maleVoice = voices[0];
    }
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = maleVoice;
    window.speechSynthesis.speak(utterance);
}

window.speechSynthesis.onvoiceschanged = getMaleVoice;

function saveHistory(userMessage, botResponse) {
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    history.push({ user: userMessage, bot: botResponse });
    localStorage.setItem('chatHistory', JSON.stringify(history));
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    historyMessages.innerHTML = '';

    if (history.length === 0) {
        historyMessages.innerHTML = 'История пуста.';
    } else {
        history.forEach(entry => {
            const messageElement = document.createElement('div');
            messageElement.innerHTML = `<strong style="color:black">Вы: </strong><span style="color:black">${entry.user}</span><br><strong style="color:black">Бот: </strong><span style="color:black">${entry.bot}</span><br><hr>`;
            historyMessages.appendChild(messageElement);
        });
    }
}

sendButton.addEventListener('click', async () => {
    const inputValue = userInput.value;
    if (inputValue.trim() === '') return;

    userInput.value = '';

    fetch("http://10.10.2.30:7860/api/v1/run/f2ad3722-8930-406c-b06d-54ddd58b8a18?stream=false", {
        method: "POST",
        headers: {
            "x-api-key":"sk-kbcXwSDD3FDg9YJieVPKZJ7O7G026jdgp3ocsi37Fxo",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            input_value: inputValue,
            output_type: "chat",
            input_type: "chat",
            tweaks: {
                "ChatInput-6xZFe": {},
                "ChatOutput-NpJtM": {},
                "OpenRouterComponent-j6Unw": {},
                "File-78hsT": {},
                "ParseData-Uzywv": {},
                "Memory-yFNvs": {},
                "CombineText-ghmAx": {}
            }
        }),
    })
    .then(res => res.json())
    .then(data => {
        const botResponse = data.outputs[0].outputs[0].results.message.text;
        speak(botResponse);
        saveHistory(inputValue, botResponse);
    })
    .catch(error => console.error('Error:', error));
});

userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

historyButton.addEventListener('click', () => {
    displayHistory();
    historyModal.style.display = 'flex';
});

closeHistoryButton.addEventListener('click', () => {
    historyModal.style.display = 'none';
});

historyModal.addEventListener('click', (event) => {
    if (event.target === historyModal) {
        historyModal.style.display = 'none';
    }
});

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'ru-RU';

  recognition.onstart = function() {
    voiceButton.classList.add('active');
    userInput.placeholder = 'Слушаю...';
  };

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    voiceButton.classList.remove('active');
    userInput.placeholder = 'Введите ваш вопрос...';
  };

  recognition.onerror = function(event) {
    voiceButton.classList.remove('active');
    let errorMessage = 'Ошибка распознавания';
    
    if (!checkInternetConnection()) {
        errorMessage = 'Нет интернет-соединения. Проверьте подключение к сети.';
        userInput.placeholder = errorMessage;
        console.error('Ошибка соединения:', event.error);
        return;
    }

    switch(event.error) {
        case 'no-speech':
            errorMessage = 'Речь не обнаружена. Пожалуйста, говорите четче.';
            break;
        case 'audio-capture':
            errorMessage = 'Микрофон не найден. Проверьте подключение микрофона.';
            break;
        case 'not-allowed':
            errorMessage = 'Доступ к микрофону запрещен. Разрешите доступ в настройках браузера.';
            break;
        case 'aborted':
            errorMessage = 'Распознавание прервано. Попробуйте снова.';
            break;
        case 'network':
            errorMessage = 'Проблемы с сетью. Проверьте подключение к интернету.';
            break;
        case 'language-not-supported':
            errorMessage = 'Язык не поддерживается. Пожалуйста, используйте русский язык.';
            break;
        default:
            errorMessage = 'Произошла неизвестная ошибка. Пожалуйста, попробуйте снова.';
    }
    
    userInput.placeholder = errorMessage;
    console.error('Ошибка распознавания:', event.error);
  };

  recognition.onend = function() {
    voiceButton.classList.remove('active');
    if (userInput.placeholder === 'Слушаю...') {
      userInput.placeholder = 'Введите ваш вопрос...';
    }
  };

  voiceButton.addEventListener('click', function() {
    if (!checkInternetConnection()) {
        userInput.placeholder = 'Нет интернет-соединения. Проверьте подключение к сети.';
        return;
    }
    
    if (voiceButton.classList.contains('active')) {
        recognition.stop();
    } else {
        recognition.start();
    }
  });
} else {
  voiceButton.style.display = 'none';
  console.warn('Ваш браузер не поддерживает голосовой ввод');
}

function checkInternetConnection() {
    return navigator.onLine;
}

window.addEventListener('online', () => {
    console.log('Соединение восстановлено');
});

window.addEventListener('offline', () => {
    console.log('Соединение потеряно');
    userInput.placeholder = 'Нет интернет-соединения. Проверьте подключение к сети.';
});