# Escalonador de Processos

Simulador e Analisador dos algoritmos de um escalonador de processos

## Introdução

O Escalonador de Processos é uma ferramenta educacional e interativa que permite simular e visualizar diferentes algoritmos de escalonamento de processos em um sistema operacional. Com uma interface amigável, você pode adicionar processos, definir suas prioridades e tempos de execução, e observar como diferentes algoritmos gerenciam a execução.

## Algoritmos de Escalonamento

### FCFS (First-Come, First-Served)
- **Descrição:** Executa os processos na ordem em que foram adicionados.
- **Utilidade:** Simples e fácil de implementar, adequado para cenários onde a ordem de chegada é importante.
- **Desvantagens:** Pode levar a longos tempos de espera para processos que chegam logo após um processo demorado. Não é adaptável às necessidades variáveis dos processos.

### SJF (Shortest Job First)
- **Descrição:** Executa os processos na ordem do tempo de execução estimado, do menor para o maior.
- **Utilidade:** Eficiente para minimizar o tempo médio de espera, especialmente quando há muitos processos curtos.
- **Desvantagens:** Pode levar à inanição de processos mais longos. Requer conhecimento prévio do tempo de execução, o que nem sempre é possível.

### RR (Round Robin)
- **Descrição:** Executa os processos em quantidades de tempo iguais (quantum), rotacionando entre eles.
- **Utilidade:** Oferece uma distribuição justa do tempo de CPU, garantindo que todos os processos recebam atenção regular.
- **Desvantagens:** Pode não ser ideal para processos com diferentes requisitos de tempo, levando a ineficiências. A escolha inadequada do quantum pode afetar o desempenho.

### PriorityRR (Priority Round Robin)
- **Descrição:** Variação do Round Robin que leva em consideração a prioridade dos processos.
- **Utilidade:** Permite controlar a ordem de execução com base na prioridade. Útil quando os processos têm diferentes níveis de importância.
- **Desvantagens:** A atribuição inadequada de prioridades pode levar a inanição ou ineficiências. Mais complexo de implementar e gerenciar do que o Round Robin padrão.

## Características

### Add Process
- **Tempo de Acesso:** Defina o tempo estimado para a execução de cada processo.
- **Prioridade:** Atribua uma prioridade de 1 a 10 para cada processo com PriorityRR, influenciando a ordem de execução nesse algorítimo.

### Process Status
- **Name:** Nome do processo.
- **Percentage Completed:** Porcentagem de conclusão do processo.
- **Time Estimated:** Tempo estimado para a execução do processo.
- **Priority:** Prioridade atribuída ao processo.

### Process Queue
- **Fila de Processos:** Visualize os processos que estão aguardando para serem executados.
- **Tipo de Algoritmo:** Visualize o algoritmo de escalonamento utilizado (FCFS, SJF, Round Robin, Priority Round Robin).

### Algorithm Settings
- **Quantum:** Altere o quantum para o algoritmo Round Robin.
- **Context Switch Time:** Defina o tempo de troca de contexto entre processos.

### Resultados dos Algoritmos
- **Comparação:** Veja os resultados e compare o desempenho dos diferentes algoritmos de escalonamento.

## Como Começar

Para começar a usar o Escalonador de Processos, abra o site em seu navegador https://sandersohngen.github.io/escalonador-de-processos/. Utilize as abas e configurações disponíveis para adicionar processos, definir suas propriedades e iniciar a simulação.
