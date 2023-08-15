import ProcessFactory from "./process.js";
import { FCFS, SJF, RR, PriorityRR } from "./scheduler.js";

export default class InterfaceManager {
    constructor() {
        this.processQueue = [];
    }

    init() {
        document
            .getElementById("addProcess")
            .addEventListener("click", () => this.handleProcessAddition());
        document
            .getElementById("startSimulation")
            .addEventListener("click", () => this.handleSimulationStart());
        document
            .getElementById("resetSimulation")
            .addEventListener("click", () => this.handleReset());
        document
            .getElementById("executionTime")
            .addEventListener("input", (e) =>
                this.updateSliderValue(e.target, "executionTimeValue")
            );
        document
            .getElementById("priority")
            .addEventListener("input", (e) =>
                this.updateSliderValue(e.target, "priorityValue")
            );
        this.addSliderListener("executionTime", "executionTimeValue");
        this.addSliderListener("priority", "priorityValue");
        this.addSliderListener("quantum", "quantumValue");
        this.addSliderListener("contextSwitchTime", "contextSwitchTimeValue");
    }

    addProcess(executionTime, priority) {
        const newProcess = ProcessFactory.createProcessWithValues(
            executionTime,
            priority
        );
        this.processQueue.push(newProcess);
        this.addProcessToVisualQueue(newProcess);
    }

    getScheduler(algorithmType, processQueue) {
        const contextSwitchTime = parseInt(
            document.getElementById("contextSwitchTime").value,
            10
        );
        const quantum = parseInt(document.getElementById("quantum").value, 10);

        const mapping = {
            FCFS: () => new FCFS(processQueue, contextSwitchTime),
            SJF: () => new SJF(processQueue, contextSwitchTime),
            RR: () => new RR(processQueue, contextSwitchTime, quantum),
            PriorityRR: () => new PriorityRR(processQueue, contextSwitchTime, quantum),
        };

        return mapping[algorithmType] ? mapping[algorithmType]() : null;
    }

    async handleSimulationStart() {
        this.clearAlgorithmTable();
        const auxQueue = this.deepCopy(this.processQueue);
        const algorithms = ["FCFS", "SJF", "RR", "PriorityRR"];
        for (let algorithm of algorithms) {
            this.processQueue = this.deepCopy(auxQueue);
            const scheduler = this.getScheduler(algorithm, this.processQueue);
            this.updateVisualAlgorithmName(algorithm);
            if (scheduler) {
                await scheduler.run(this);
                this.clearProcessTable();
                this.logAlgorithmTime(algorithm, scheduler.totalExecutionTime);
            }
        }
        this.processQueue = []
    }

    deepCopy(original) {
        const copy = []
        original.forEach(process => 
            copy.push(ProcessFactory.createCopiedProcess(process)));
        return copy;
    }

    clearProcessTable() {
        const tableBody = document
            .getElementById("processStatusTable")
            .getElementsByTagName("tbody")[0];
        tableBody.innerHTML = "";
    }

    logAlgorithmTime(algorithm, totalExecutionTime) {
        const tableBody = document
            .getElementById("algorithmResultsTable")
            .getElementsByTagName("tbody")[0];
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = algorithm;
        row.insertCell(1).textContent = totalExecutionTime;
    }

    updateVisualAlgorithmName(algorithmName) {
        const algorithm = document.getElementById("currentAlgorithm");
        algorithm.textContent = algorithmName;
    }

    handleReset() {
        this.processQueue = [];
        this.clearAlgorithmTable();
        this.clearProcessTable();
    }

    clearAlgorithmTable() {
        const tableBody = document
            .getElementById("algorithmResultsTable")
            .getElementsByTagName("tbody")[0];
        tableBody.innerHTML = "";
    }

    updateSliderValue(slider, outputId) {
        const output = document.getElementById(outputId);
        output.textContent = slider.value;
    }

    handleProcessAddition() {
        const executionTime = parseInt(
            document.getElementById("executionTime").value,
            10
        );
        const priority = parseInt(document.getElementById("priority").value, 10);
        this.addProcess(executionTime, priority);
    }

    addSliderListener(sliderId, outputId) {
        const slider = document.getElementById(sliderId);
        if (slider)
            slider.addEventListener("input", () =>
                this.updateSliderValue(slider, outputId)
            );
    }

    addProcessToVisualQueue(process) {
        const queueContainer = document.getElementById("processQueue");
        const processCard = document.createElement("div");
        processCard.className = "process-card";
        processCard.classList.add(`priority-${process.priority}`);

        const processName = document.createElement("p");
        processName.className = "process-name";
        processName.textContent = process.name;

        processCard.append(processName);
        queueContainer.appendChild(processCard);
    }

    async indicateContextSwitch(contextSwitchTime) {
        return new Promise((resolve) => {
            const statusIndicator = document.getElementById(
                "current-status-indicator"
            );
            statusIndicator.textContent = "Switching Context";
            setTimeout(() => {
                statusIndicator.textContent = "";
                resolve();
            }, contextSwitchTime * 1000);
        });
    }

    startProcessVisually(process) {
        const statusIndicator = document.getElementById(
            "current-status-indicator"
        );
        statusIndicator.textContent = `Executing ${process.name}`;
    }

    endProcessVisually(process) {
        const tableBody = document
            .getElementById("processStatusTable")
            .getElementsByTagName("tbody")[0];

        let row = tableBody.querySelector(
            `tr[data-process-name="${process.name}"]`
        );
        if (!row) {
            row = tableBody.insertRow();
            row.setAttribute("data-process-name", process.name);
            row.insertCell(0).textContent = process.name;
            row.insertCell(1);
            row.insertCell(2).textContent = process.executionTime;
            row.insertCell(3).textContent = process.priority;
        }
        row.cells[1].textContent = `${process.percentageComplete.toFixed(1)}%`;
        const statusIndicator = document.getElementById(
            "current-status-indicator"
        );
        statusIndicator.textContent = "Waiting";
    }

    updateVisualQueue(processQueue) {
        const queueContainer = document.getElementById("processQueue");
        queueContainer.innerHTML = "";
        processQueue.forEach((process) => { this.addProcessToVisualQueue(process); });
    }
}
