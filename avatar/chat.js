document.addEventListener('DOMContentLoaded', () => {
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const historyButton = document.getElementById('history-button');
  const historyModal = document.getElementById('history-modal');
  const historyMessages = document.getElementById('history-messages');
  const closeHistoryButton = document.getElementById('close-history');
  const errorModal = document.getElementById('error-modal');
  const closeModal = document.querySelector('.close-modal');
  let maleVoice = null;

  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
      sessionId = 'chat-' + Date.now();
      localStorage.setItem('sessionId', sessionId);
  }
  console.log("Current Session ID:", sessionId);

  function getMaleVoice() {
      const voices = window.speechSynthesis.getVoices();
      maleVoice = voices.find(voice => voice.name.includes('Male') || voice.name.includes('мужской'));
      if (!maleVoice) {
          maleVoice = voices[1];
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
          historyMessages.classList.add('empty');
      } else {
          historyMessages.classList.remove('empty');
          history.forEach(entry => {
              const messageElement = document.createElement('div');
              messageElement.innerHTML = `<strong style="color:black">Вы: </strong><span style="color:black">${entry.user}</span><br><strong style="color:black">Бот: </strong><span style="color:black">${entry.bot}</span><br><hr>`;
              historyMessages.appendChild(messageElement);
          });
      }
  }

  function showError() {
    errorModal.style.display = 'block';
  }

  function hideError() {
    errorModal.style.display = 'none';
  }

  if (closeModal) {
    closeModal.addEventListener('click', hideError);
  }

  window.addEventListener('click', (event) => {
    if (event.target === errorModal) {
      hideError();
    }
  });

  sendButton.addEventListener('click', async () => {
    const inputValue = userInput.value.trim();

    userInput.value = '';
    
    if (!inputValue) {
        userInput.placeholder = 'Пожалуйста, введите вопрос';
        userInput.classList.add('error');
        return;
    }
    
    try {
        const response = await fetch("http://10.10.2.30:7860/api/v1/run/f2ad3722-8930-406c-b06d-54ddd58b8a18?stream=false", {
            method: "POST",
            headers: {
                "x-api-key":"sk-kbcXwSDD3FDg9YJieVPKZJ7O7G026jdgp3ocsi37Fxo",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input_value: inputValue,
                output_type: "chat",
                input_type: "chat",
                session_id: sessionId,
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
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.outputs || !data.outputs[0] || !data.outputs[0].outputs[0] || !data.outputs[0].outputs[0].results) {
            throw new Error('Некорректный формат ответа от сервера');
        }

        const botResponse = data.outputs[0].outputs[0].results.message.text;
        speak(botResponse);
        saveHistory(inputValue, botResponse);
    } catch (error) {
        console.error('Ошибка:', error);
        showError();
    }
  });

  userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
  });

  userInput.addEventListener('input', () => {
    userInput.classList.remove('error');
    userInput.placeholder = 'Задай вопрос...';
  });

  historyButton.addEventListener('click', () => {
    displayHistory();
    historyModal.style.display = 'block';
  });

  closeHistoryButton.addEventListener('click', () => {
    historyModal.style.display = 'none';
  });

  historyModal.addEventListener('click', (event) => {
    if (event.target === historyModal) {
        historyModal.style.display = 'none';
    }
  });

  window.addEventListener('online', () => {
      console.log('Соединение восстановлено');
  });

  window.addEventListener('offline', () => {
      console.log('Соединение потеряно');
      userInput.placeholder = 'Нет интернет-соединения. Проверьте подключение к сети.';
  });

  document.getElementById('history-button').addEventListener('click', function() {
      document.getElementById('history-modal').style.display = 'block';
  });

  document.getElementById('close-history').addEventListener('click', function() {
      document.getElementById('history-modal').style.display = 'none';
  });

  window.addEventListener('click', function(event) {
      const historyModal = document.getElementById('history-modal');
      if (event.target === historyModal) {
          historyModal.style.display = 'none';
      }
      
      const errorModal = document.getElementById('error-modal');
      if (event.target === errorModal) {
          errorModal.style.display = 'none';
      }
  });
});