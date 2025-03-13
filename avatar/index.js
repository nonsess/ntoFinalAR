document.addEventListener('DOMContentLoaded', () => {
  const cameraPrompt = document.getElementById('camera-permission-prompt');
  const requestCameraButton = document.getElementById('request-camera-access');
  const chatContainer = document.getElementById('chat-container');

  chatContainer.style.display = 'none';
  checkCameraAccess();

  requestCameraButton.addEventListener('click', () => {
    requestCameraAccess();
  });

  function checkCameraAccess() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        cameraPrompt.style.display = 'none';
        chatContainer.style.display = 'flex';
        const scene = document.querySelector('a-scene');
        if (scene) {
          scene.emit('reload');
        }
      })
      .catch((error) => {
        console.error('Ошибка доступа к камере:', error);
        cameraPrompt.style.display = 'block';
        cameraPrompt.querySelector('p').textContent = 'Для того чтобы поговорить с Аркадием, пожалуйста, предоставь доступ к камере.';
      });
  }

  function requestCameraAccess() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        cameraPrompt.style.display = 'none';
        chatContainer.style.display = 'flex';
        const scene = document.querySelector('a-scene');
        if (scene) {
          scene.emit('reload');
        }
      })
      .catch((error) => {
        console.error('Ошибка доступа к камере:', error);
        cameraPrompt.querySelector('p').textContent = 'Доступ к камере запрещен. Пожалуйста, разреши доступ в настройках браузера.';
      });
  }
});