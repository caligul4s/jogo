export default class Colonist {
  constructor(scene, x, y, taskManager, data) {
    this.scene = scene;
    this.autoWork = false;
    this.taskManager = taskManager;
    this.speed = 100;
    this.targetTask = null;
    this.targetPosition = null;

    this.sprite = scene.physics.add.sprite(x, y, 'colonist');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body.moves = true;

    this.name = data.name || 'Alex';
    this.skills = data.skills || { construction: 1 };
    this.traits = data.traits || ['Paciente', 'Curioso'];
    this.inventory = [];
  }

  update() {
    if (this.targetPosition) {
      this.moveToPositionUpdate();
    } else if (this.autoWork) {
      if (!this.targetTask || !this.targetTask.target.active) {
        this.targetTask = this.taskManager.getNextAvailableTask();
      }
  
      if (this.targetTask) {
        this.moveTo(this.targetTask.target);
      } else {
        this.sprite.setVelocity(0, 0);
      }
    }
  }
  
  
  moveToPosition(x, y) {
    this.targetPosition = { x, y };
    this.targetTask = null;
  }

  moveToPositionUpdate() {
    const dx = this.targetPosition.x - this.sprite.x;
    const dy = this.targetPosition.y - this.sprite.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 4) {
      const angle = Math.atan2(dy, dx);
      this.sprite.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
    } else {
      this.sprite.setVelocity(0, 0);
      this.targetPosition = null;
    }
  }

  moveTo(target) {
    const dx = target.x - this.sprite.x;
    const dy = target.y - this.sprite.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 4) {
      const angle = Math.atan2(dy, dx);
      this.sprite.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
    } else {
      this.sprite.setVelocity(0, 0);
      this.completeTask();
    }
  }

  completeTask() {
    if (!this.targetTask) return;
  
    if (this.targetTask.type === 'build') {
      this.targetTask.progress += this.skills.construction;
      if (this.targetTask.progress >= this.targetTask.requiredProgress) {
        this.targetTask.target.setTexture('tile');
        this.skills.construction += 0.1;
        this.targetTask.done = true;
      }
    } else if (this.targetTask.type === 'chop') {
      this.inventory.push('wood');
  
      if (this.targetTask.layer && this.targetTask.tileRef) {
        this.targetTask.layer.removeTileAt(
          this.targetTask.tileRef.x,
          this.targetTask.tileRef.y
        );
      }
  
      if (this.targetTask.target && this.targetTask.target.destroy) {
        this.targetTask.target.destroy();
      }
  
      this.targetTask.done = true;
    } else {
      this.inventory.push(this.targetTask.target.texture?.key || 'item');
      this.targetTask.target?.destroy?.();
      this.targetTask.done = true;
    }
  
    this.targetTask = null;
  }
}  
