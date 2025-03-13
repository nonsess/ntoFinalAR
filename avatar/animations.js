document.addEventListener('DOMContentLoaded', () => {
    const nerpa = document.querySelector('[gltf-model="url(/public/models/nerpa.glb)"]');
    const chaika = document.querySelector('[gltf-model="url(/public/models/chaika.glb)"]');
  
    if (!nerpa || !chaika) {
      console.error('Не удалось найти модели нерпы или чайки.');
      return;
    }
  
    nerpa.setAttribute('animation', {
      property: 'position',
      to: '1 1 0',
      dur: 3000,
      easing: 'easeInOutSine',
      loop: true,
      startEvents: 'markerFound',
      pauseEvents: 'markerLost'
    });
  
    nerpa.setAttribute('animation__rotation', {
      property: 'rotation',
      to: '0 360 0',
      dur: 5000,
      easing: 'linear',
      loop: true,
      startEvents: 'markerFound',
      pauseEvents: 'markerLost'
    });
});