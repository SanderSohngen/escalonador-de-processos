class Scheduler {
  constructor(processes, contextSwitchTime) {
    this.processQueue = processes;
    this.contextSwitchTime = contextSwitchTime;
    this.totalExecutionTime = 0;
  }

  async run(interfaceManager) {
    throw new Error("Método run deve ser implementado pela subclasse.");
  }
}

export class FCFS extends Scheduler {
  async run(interfaceManager) {
    while (this.processQueue.length > 0) {
      interfaceManager.updateVisualQueue(this.processQueue);
      const process = this.processQueue.shift();

      this.totalExecutionTime += process.remainingTime;
      await process.execute(process.remainingTime, interfaceManager);

      if (this.processQueue.length > 0) {
        this.totalExecutionTime += this.contextSwitchTime;
        await interfaceManager.indicateContextSwitch(this.contextSwitchTime);
      }
    }
    interfaceManager.updateVisualQueue(this.processQueue);
  }
}

export class SJF extends FCFS {
  async run(interfaceManager) {
    this.processQueue.sort((a, b) => a.executionTime - b.executionTime);
    await super.run(interfaceManager);
  }
}

export class RR extends Scheduler {
  constructor(processes, contextSwitchTime, quantum) {
    super(processes, contextSwitchTime);
    this.quantum = quantum;
  }

  async run(interfaceManager) {
    while (this.processQueue.length > 0) {
      interfaceManager.updateVisualQueue(this.processQueue);
      const process = this.processQueue.shift();
      const executionTime = Math.min(this.quantum, process.remainingTime);

      this.totalExecutionTime += executionTime;
      await process.execute(executionTime, interfaceManager);

      if (this.processQueue.length > 0) {
        this.totalExecutionTime += this.contextSwitchTime;
        await interfaceManager.indicateContextSwitch(this.contextSwitchTime);
      }
      if (!process.isComplete())
        this.processQueue.push(process);
    }
    interfaceManager.updateVisualQueue(this.processQueue);
  }
}

export class PriorityRR extends Scheduler {
  constructor(processes, contextSwitchTime, quantum) {
    super(processes, contextSwitchTime);
    this.quantum = quantum;
  }

  async run(interfaceManager) {
    const priorityGroups = this.groupByPriority();
    
    const sortedPriorityGroups = Object.keys(priorityGroups)
      .sort((a, b) => b - a)
      .map(priority => priorityGroups[priority]);
      
    for (const processes of sortedPriorityGroups) {
      const rr = new RR(processes, this.contextSwitchTime, this.quantum);
      await rr.run(interfaceManager);
      this.totalExecutionTime += rr.totalExecutionTime;
    }
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
