class Process {
  constructor(name, executionTime, priority) {
    this.name = name;
    this.percentageComplete = 0;
    this.executionTime = executionTime;
    this.remainingTime = executionTime;
    this.priority = priority;
  }

  async execute(time, interfaceManager) {
    return new Promise((resolve) => {
      this.remainingTime -= time;
      this.percentageComplete =
        ((this.executionTime - this.remainingTime) / this.executionTime) * 100;
        interfaceManager.startProcessVisually(this)
      setTimeout(() => {
        interfaceManager.endProcessVisually(this);
        resolve();
      }, time * 1000);
    });
  }

  isComplete() {
    return this.remainingTime <= 0;
  }
}

export default class ProcessFactory {
  static #counter = 0;

  static createProcessWithValues(executionTime, priority) {
    this.#counter += 1;
    const name = `P${this.#counter}`;
    return new Process(name, executionTime, priority);
  }

  static createCopiedProcess(process) {
    return new Process(process.name, process.executionTime, process.priority);
  }

  static createRandomProcess() {
    const executionTime = Math.floor(Math.random() * 60) + 1;
    const priority = Math.floor(Math.random() * 10) + 1;
    return this.createProcessWithValues(executionTime, priority);
  }
}
