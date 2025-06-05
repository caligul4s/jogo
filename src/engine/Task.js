// engine/Task.js

export default class Task {
  constructor(type, target) {
    this.type = type;
    this.target = target; // sprite o game object
    this.progress = 0;
    this.requiredProgress = 100;
    this.done = false;
  }
}
