document.addEventListener('DOMContentLoaded', () => {
    const nerpa = document.querySelector('#nerpa-entity');
    const chaika = document.querySelector('#model-entity');
    if (!nerpa || !chaika) {
        console.error('Не удалось найти модели нерпы или чайки.');
        return;
    }

    // Устанавливаем начальную позицию нерпы
    nerpa.setAttribute('position', '1 0 0');
    // Компонент для движения по окружности
    AFRAME.registerComponent('circle-movement', {
        schema: {
            radius: { type: 'number', default: 1 },
            speed: { type: 'number', default: 1 }
        },
        init: function () {
            this.angle = 0;
        },
        tick: function (time, timeDelta) {
            this.angle += (this.data.speed * timeDelta) / 1000;
            
            // Вычисляем новую позицию на окружности
            const x = Math.cos(this.angle) * this.data.radius;
            const z = Math.sin(this.angle) * this.data.radius;
            
            // Обновляем позицию нерпы
            this.el.setAttribute('position', { x: z, y: x, z: 0 });

            // Вычисляем угол поворота в сторону движения
            const angle = Math.cos(x, z) * (180 / Math.PI)*0.5;
            this.el.setAttribute('rotation', { x:angle+255 , y: 0, z: 0});
        }
    });

    // Применяем компонент к нерпе
    nerpa.setAttribute('circle-movement', {
        radius: 1.5,
        speed: 0.5,
    });
});