class Scheduler {
  constructor(processes, contextSwitchTime) {
    this.processQueue = processes;
    this.contextSwitchTime = contextSwitchTime;
    this.totalExecutionTime = 0;
  }

  async run() {
    throw new Error("Método run deve ser implementado pela subclasse.");
  }

  async indicateContextSwitch() {
    return new Promise((resolve) => {
      const contextSwitchIndicator = document.getElementById(
        "context-switch-indicator"
      );
      contextSwitchIndicator.style.display = "block";
      setTimeout(() => {
        contextSwitchIndicator.style.display = "none";
        resolve();
      }, this.contextSwitchTime * 1000);
    });
  }
}

class FCFS extends Scheduler {
  async run() {
    while (this.processQueue.length > 0) {
      await this.indicateContextSwitch();
      const process = this.processQueue.shift();
      await process.execute(process.remainingTime);
      this.totalExecutionTime += process.executionTime + this.contextSwitchTime;
      console.log(`Processo ${process.name} completado.`);
    }
    console.log(`Tempo total de execução: ${this.totalExecutionTime}`);
  }
}

class SJF extends FCFS {
  async run() {
    this.processQueue.sort((a, b) => a.executionTime - b.executionTime);
    await super.run();
  }
}

class RR extends Scheduler {
  constructor(processes, quantum, contextSwitchTime) {
    super(processes, contextSwitchTime);
    this.quantum = quantum;
  }

  async run() {
    while (this.processQueue.length > 0) {
      await this.indicateContextSwitch();
      const process = this.processQueue.shift();
      const executionTime = Math.min(this.quantum, process.remainingTime);
      await process.execute(executionTime);
      this.totalExecutionTime += executionTime + this.contextSwitchTime;

      if (process.isComplete()) {
        console.log(`Processo ${process.name} completado.`);
      } else {
        this.processQueue.push(process);
      }
    }
    console.log(`Tempo total de execução: ${this.totalExecutionTime}`);
  }
}

class PriorityRR extends Scheduler {
  constructor(processes, quantum, contextSwitchTime) {
    super(processes, contextSwitchTime);
    this.quantum = quantum;
  }

  async run() {
    const priorityGroups = this.groupByPriority();
    for (const priority in priorityGroups) {
      const processes = priorityGroups[priority];
      const rr = new RR(processes, this.quantum, this.contextSwitchTime);
      await rr.run();
      this.totalExecutionTime += rr.totalExecutionTime;
    }
    console.log(`Tempo total de execução: ${this.totalExecutionTime}`);
  }

  groupByPriority() {
    const groups = {};
    this.processQueue.forEach((process) => {
      if (!groups[process.priority]) {
        groups[process.priority] = [];
      }
      groups[process.priority].push(process);
    });
    return groups;
  }
}
