class Process {
  constructor(name, executionTime, priority) {
    this.name = name;
    this.percentageComplete = 0;
    this.executionTime = executionTime;
    this.remainingTime = executionTime;
    this.priority = priority;
  }

  async execute(time) {
    return new Promise((resolve) => {
      this.remainingTime -= time;
      this.percentageComplete =
        ((this.executionTime - this.remainingTime) / this.executionTime) * 100;
      document.getElementById('current-process').textContent = `Executando ${this.name}`;
      setTimeout(() => resolve(), time * 1000);
    });
  }

  isComplete() {
    return this.remainingTime <= 0;
  }
}

class ProcessFactory {
  #counter = 0;

  static createProcessWithValues(executionTime, priority) {
    this.#counter += 1;
    const name = `P${this.#counter}`;
    return new Process(name, executionTime, priority);
  }

  static createRandomProcess() {
    const executionTime = Math.floor(Math.random() * 100) + 1;
    const priority = Math.floor(Math.random() * 10) + 1;
    return this.createProcessWithValues(executionTime, priority);
  }
}
