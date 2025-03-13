AFRAME.registerComponent('marker-persistence', {
    schema: {
      worldPos: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
      worldRot: { type: 'vec3', default: { x: 0, y: 0, z: 0 } }
    },
    init: function () {
      this.worldEntity = document.createElement('a-entity');
      this.worldEntity.id = 'world-entity';
      this.worldEntity.setAttribute('visible', false);
      document.querySelector('a-scene').appendChild(this.worldEntity);

      this.modelEntity = document.querySelector('#model-entity');

      this.el.addEventListener('markerFound', this.onMarkerFound.bind(this));
      this.el.addEventListener('markerLost', this.onMarkerLost.bind(this));

      this.markerVisible = false;
    },

    onMarkerFound: function () {
      this.worldEntity.setAttribute('visible', false);
      this.modelEntity.setAttribute('visible', true);
      this.markerVisible = true;
    },

    onMarkerLost: function () {
      if (this.markerVisible) {
        const worldPosition = new THREE.Vector3();
        const worldQuaternion = new THREE.Quaternion();

        this.modelEntity.object3D.getWorldPosition(worldPosition);
        this.modelEntity.object3D.getWorldQuaternion(worldQuaternion);

        worldQuaternion.setFromEuler(new THREE.Euler(89.5, 0, 0));
        this.worldEntity.object3D.position.copy(worldPosition);
        this.worldEntity.object3D.quaternion.copy(worldQuaternion);

        if (!this.worldEntity.hasChildNodes()) {
          const clonedModel = this.modelEntity.cloneNode(true);
          clonedModel.id = 'world-model';
          this.worldEntity.appendChild(clonedModel);
        }

        this.worldEntity.setAttribute('visible', true);
      }

      this.markerVisible = false;
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const cameraPrompt = document.getElementById('camera-permission-prompt');
  const requestCameraButton = document.getElementById('request-camera-access');

  // Check camera access
  checkCameraAccess();

  requestCameraButton.addEventListener('click', () => {
    requestCameraAccess();
  });

  function checkCameraAccess() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        cameraPrompt.style.display = 'none';
      })
      .catch((error) => {
        console.error('Ошибка доступа к камере:', error);
        cameraPrompt.style.display = 'block';
      });
  }

  function requestCameraAccess() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        cameraPrompt.style.display = 'none';
      })
      .catch((error) => {
        console.error('Ошибка доступа к камере:', error);
        cameraPrompt.querySelector('p').textContent = 'Доступ к камере запрещен. Пожалуйста, разреши доступ в настройках браузера.';
      });
  }
});