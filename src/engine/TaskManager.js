export default class TaskManager {
  constructor() {
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push({ ...task, done: false });
  }

  getNextAvailableTask() {
    return this.tasks.find(t => !t.done);
  }
}
