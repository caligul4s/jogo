import Colonist from '../engine/Colonist.js';
import TaskManager from '../engine/TaskManager.js';
import Task from '../engine/Task.js';
import { generateColonistData } from '../engine/ColonistFactory.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.taskManager = new TaskManager();
    this.colonists = [];
    this.selectedColonist = null;
    this.ui = document.getElementById('ui'); 
    this.map = null; // Referencia al objeto map
    this.groundLayer = null; // Referencia a la capa de tierra
    this.waterCollisionLayer = null; // Referencia a la capa de colisión de agua
  }

  preload() {
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    this.load.image('tileset', 'assets/tileset.png'); 
    this.load.image('colonist', 'assets/colonist.png'); 


  }

  create() {
    this.map = this.make.tilemap({ key: 'map' });

   
    const tileset = this.map.addTilesetImage('16x16', 'tileset'); // <--- ¡IMPORTANTE! AJUSTA 'Tileset' SI EL NOMBRE EN TU ARCHIVO TILED ES DIFERENTE.

 
    this.groundLayer = this.map.createLayer('ground', tileset, 0, 0);
    if (!this.groundLayer) {
        console.error("Error: No se pudo crear la capa 'ground'. Verifica el nombre de la capa en Tiled y en tu map.json.");
    }

    // Crea la capa de colisión de agua.
    this.waterCollisionLayer = this.map.createLayer('watercollision', tileset, 0, 0);
    if (!this.waterCollisionLayer) {
        console.error("Error: No se pudo crear la capa 'watercollision'. Verifica el nombre de la capa en Tiled y en tu map.json.");
    } else {
      
    }


   
    if (this.waterCollisionLayer) {
        this.waterCollisionLayer.setCollisionByExclusion([-1]);

      
    }


    // 5. Generación de colonos y configuración de colisiones con el mapa
    for (let i = 0; i < 1; i++) { // Crear 1 colono para el ejemplo
      const colonistData = generateColonistData();
      const colonist = new Colonist(this, 100 + i * 50, 100, this.taskManager, colonistData);
      colonist.nameText = this.add.text(colonist.sprite.x, colonist.sprite.y - 30, colonist.name, { fontSize: '12px', fill: '#fff', resolution: 2 }).setOrigin(0.5);
      this.colonists.push(colonist);

      if (this.waterCollisionLayer) {
        this.physics.add.collider(colonist.sprite, this.waterCollisionLayer);
      }
    }

    if (this.colonists.length > 0) {
        this.selectedColonist = this.colonists[0]; 
    }


    // 6. Configurar la cámara
    const camera = this.cameras.main;
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    if (this.selectedColonist) {
        camera.startFollow(this.selectedColonist.sprite);
    }
    camera.setZoom(2); // Ajusta el zoom si lo necesitas


    
    // 8. Configuración de la interfaz de usuario (UI) y eventos de entrada
    this.input.keyboard.on('keydown-W', () => {
      if (this.selectedColonist) {
        this.selectedColonist.autoWork = !this.selectedColonist.autoWork;
        console.log('🔁 Auto trabajo:', this.selectedColonist.autoWork);
        this.updateUI(); // Actualiza la UI inmediatamente al cambiar el estado
      }
    });

    this.updateUI(); // Llama para inicializar la UI

    this.input.on('pointerdown', (pointer) => {
      // Solo procesa el click si es dentro del canvas del juego
      if (pointer.event.target.tagName !== 'CANVAS') return;

      const worldPoint = pointer.positionToCamera(this.cameras.main);
      const x = worldPoint.x;
      const y = worldPoint.y;

      if (this.selectedColonist) {
        
             this.selectedColonist.moveToPosition(x, y);
        // }
      }
    });
  }

  update(time, delta) {
    this.colonists.forEach(colonist => {
      colonist.update(time, delta); // Llama al update de cada colono
      if (colonist.nameText) {
        colonist.nameText.setPosition(colonist.sprite.x, colonist.sprite.y - 30);
      }
    });
    
  }

  updateUI() {
    if (!this.ui) {
        // console.warn("Elemento UI no encontrado. La UI no se actualizará.");
        return;
    }
    if (!this.colonists.length || !this.selectedColonist) { // Asegura que haya un colono seleccionado
        this.ui.innerHTML = "<p>Ningún colono seleccionado o disponible.</p>";
        return;
    }
    
    // Usa this.selectedColonist en lugar de this.colonists[0] para mostrar el colono actualmente seleccionado
    const colonist = this.selectedColonist; 
    const traits = colonist.traits.map(tr => `• ${tr}`).join('<br>'); // Mejor visualización para múltiples rasgos
    
    let taskInfo = '<p>Sin tarea</p>';
    if (colonist.targetTask) {
        const progressPercent = (colonist.targetTask.progress / colonist.targetTask.requiredProgress) * 100;
        taskInfo = `
            <p>Tarea actual: ${colonist.targetTask.type} 
            (${colonist.targetTask.progress.toFixed(0)}/${colonist.targetTask.requiredProgress.toFixed(0)} - ${progressPercent.toFixed(1)}%)
            </p>`;
    }

    this.ui.innerHTML = `
      <h3>${colonist.name}</h3>
      <p><strong>Habilidades:</strong><br>Construcción: ${colonist.skills.construction.toFixed(1)}</p>
      <p><strong>Rasgos:</strong><br>${traits || 'Ninguno'}</p>
      <p><strong>Inventario:</strong> ${colonist.inventory.join(', ') || 'Vacío'}</p>
      <p><strong>Trabajo automático:</strong> <span style="font-weight: bold; color: ${colonist.autoWork ? 'green' : 'red'};">
        ${colonist.autoWork ? 'ACTIVADO' : 'DESACTIVADO'}
      </span></p>
      ${taskInfo}
    `;
  }
}
