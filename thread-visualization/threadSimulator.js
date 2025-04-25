class ThreadPool {
    constructor(initialSize = 4) {
        this.threads = [];
        this.taskQueue = [];
        this.running = false;
        this.completedTasks = 0;
        this.threadIdCounter = 0;
        this.taskIdCounter = 0;
        this.defaultTestInProgress = false;
        this.defaultTestConfig = {
            totalTasks: 100,
            numThreads: 10,
            batchSize: 10,
            batchDelay: 100
        };
        
        // Performance metrics
        this.metrics = {
            totalCompletionTime: 0,
            totalQueueTime: 0,
            startTime: null,
            endTime: null,
            threadBusyTime: new Map(),
            lastUpdate: Date.now(),
            isFinalized: false
        };

        // Initialize DOM elements
        this.threadsContainer = document.getElementById('threads');
        this.queueContainer = document.getElementById('queue');
        this.logContainer = document.getElementById('logContainer');
        this.statsElements = {
            activeThreads: document.getElementById('activeThreads'),
            queueSize: document.getElementById('queueSize'),
            completedTasks: document.getElementById('completedTasks'),
            avgCompletionTime: document.getElementById('avgCompletionTime'),
            threadUtilization: document.getElementById('threadUtilization'),
            throughput: document.getElementById('throughput'),
            avgQueueTime: document.getElementById('avgQueueTime')
        };

        // Initialize threads
        for (let i = 0; i < initialSize; i++) {
            this.createThread();
        }

        this.updateStats();
        this.startPerformanceMonitoring();
    }

    createThread() {
        const threadId = ++this.threadIdCounter;
        const thread = {
            id: threadId,
            state: 'idle',
            currentTask: null,
            element: this.createThreadElement(threadId)
        };
        this.threads.push(thread);
        this.threadsContainer.appendChild(thread.element);
        this.log(`Thread ${threadId} created`);
        return thread;
    }

    createThreadElement(id) {
        const element = document.createElement('div');
        element.className = 'thread idle';
        element.id = `thread-${id}`;
        element.textContent = `T${id}`;
        return element;
    }

    createTask() {
        const taskId = ++this.taskIdCounter;
        const task = {
            id: taskId,
            duration: Math.floor(Math.random() * 2000) + 1000, // Reduced max duration to 3 seconds
            element: this.createTaskElement(taskId),
            createdAt: Date.now()
        };
        this.taskQueue.push(task);
        this.queueContainer.appendChild(task.element);
        this.log(`Task ${taskId} added to queue`);
        this.updateStats();
        return task;
    }

    createTaskElement(id) {
        const element = document.createElement('div');
        element.className = 'task';
        element.id = `task-${id}`;
        element.textContent = `Task ${id}`;
        return element;
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.metrics.startTime = Date.now();
        this.metrics.endTime = null;
        this.metrics.isFinalized = false;
        this.log('Thread pool started');
        this.processQueue();
    }

    stop(autoStop = false) {
        if (!this.running) return;
        this.running = false;
        this.metrics.endTime = Date.now();
        this.metrics.isFinalized = true;
        
        // Update button text
        const btn = document.getElementById('startBtn');
        btn.textContent = 'Start Simulation';
        
        this.log(autoStop ? 'Thread pool stopped: All tasks completed' : 'Thread pool stopped manually');
        this.updatePerformanceStats(); // Final update of stats
    }

    async processQueue() {
        while (this.running) {
            const availableThread = this.threads.find(t => t.state === 'idle');
            const nextTask = this.taskQueue[0];

            if (availableThread && nextTask) {
                this.assignTaskToThread(nextTask, availableThread);
            } else if (this.taskQueue.length === 0 && this.threads.every(t => t.state === 'idle')) {
                // Auto-stop when all tasks are completed and all threads are idle
                this.stop(true);
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    async assignTaskToThread(task, thread) {
        // Calculate queue time
        const queueTime = Date.now() - task.createdAt;
        this.metrics.totalQueueTime += queueTime;

        // Remove task from queue
        this.taskQueue.shift();
        task.element.remove();

        // Update thread state
        thread.state = 'running';
        thread.currentTask = task;
        thread.element.className = 'thread running';
        
        const startTime = Date.now();
        this.log(`Thread ${thread.id} started processing Task ${task.id}`);
        this.updateStats();

        // Simulate task processing
        await new Promise(resolve => setTimeout(resolve, task.duration));

        // Update metrics
        const completionTime = Date.now() - startTime;
        this.metrics.totalCompletionTime += completionTime;
        this.metrics.threadBusyTime.set(
            thread.id,
            (this.metrics.threadBusyTime.get(thread.id) || 0) + completionTime
        );

        // Complete task
        thread.state = 'idle';
        thread.currentTask = null;
        thread.element.className = 'thread idle';
        this.completedTasks++;
        
        this.log(`Thread ${thread.id} completed Task ${task.id}`);
        this.updateStats();
    }

    killThread() {
        if (this.threads.length <= 1) {
            this.log('Cannot kill last thread');
            return;
        }

        const idleThread = this.threads.find(t => t.state === 'idle');
        if (!idleThread) {
            this.log('No idle thread available to kill');
            return;
        }

        // Remove thread
        this.threads = this.threads.filter(t => t.id !== idleThread.id);
        idleThread.element.className = 'thread terminated';
        setTimeout(() => idleThread.element.remove(), 1000);
        
        this.log(`Thread ${idleThread.id} terminated`);
        this.updateStats();
    }

    log(message) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.logContainer.insertBefore(entry, this.logContainer.firstChild);
    }

    startPerformanceMonitoring() {
        // Clear any existing interval
        if (this._monitoringInterval) {
            clearInterval(this._monitoringInterval);
        }
        
        // Start new monitoring interval
        this._monitoringInterval = setInterval(() => {
            if (this.running || !this.metrics.isFinalized) {
                this.updatePerformanceStats();
            }
        }, 1000);
    }

    updatePerformanceStats() {
        const now = Date.now();
        
        // Use endTime for calculations if simulation is stopped
        const timeSinceStart = this.metrics.isFinalized
            ? (this.metrics.endTime - this.metrics.startTime)
            : (this.metrics.startTime ? (now - this.metrics.startTime) : 0);
        
        // Don't update metrics if simulation hasn't started or has no tasks
        if (!this.metrics.startTime || this.completedTasks === 0) {
            return;
        }

        // Calculate average completion time (in seconds)
        const avgCompletionTime = (this.metrics.totalCompletionTime / this.completedTasks / 1000).toFixed(2);

        // Calculate average queue time (in seconds)
        const avgQueueTime = (this.metrics.totalQueueTime / this.completedTasks / 1000).toFixed(2);

        // Calculate thread utilization (capped at 100%)
        let totalUtilization = 0;
        const elapsedTimeMs = timeSinceStart || 1; // Prevent division by zero

        this.threads.forEach(thread => {
            const busyTime = this.metrics.threadBusyTime.get(thread.id) || 0;
            // Cap individual thread utilization at 100%
            const utilization = Math.min(100, (busyTime / elapsedTimeMs) * 100);
            totalUtilization += utilization;
        });

        // Calculate average utilization across all threads
        const avgUtilization = this.threads.length > 0
            ? Math.min(100, Math.round(totalUtilization / this.threads.length))
            : 0;

        // Calculate throughput (tasks per second)
        const throughput = (this.completedTasks / (timeSinceStart / 1000)).toFixed(2);

        // Update the display
        this.statsElements.avgCompletionTime.textContent = `${avgCompletionTime} s`;
        this.statsElements.threadUtilization.textContent = `${avgUtilization}%`;
        this.statsElements.throughput.textContent = `${throughput}/s`;
        this.statsElements.avgQueueTime.textContent = `${avgQueueTime} s`;
    }

    updateStats() {
        this.statsElements.activeThreads.textContent = this.threads.length;
        this.statsElements.queueSize.textContent = this.taskQueue.length;
        this.statsElements.completedTasks.textContent = this.completedTasks;
        this.updatePerformanceStats();
    }

    async runDefaultTest() {
        try {
            if (this.defaultTestInProgress) {
                this.log('Default test already in progress');
                return;
            }
            this.defaultTestInProgress = true;
            const config = this.defaultTestConfig;

            // Reset the thread pool
            this.stop();
            await this.resetThreadPool();

            // Create threads
            for (let i = 0; i < config.numThreads; i++) {
                this.createThread();
            }

            // Start the simulation
            this.start();
            this.log(`Default test started: ${config.totalTasks} tasks with ${config.numThreads} threads`);

            // Create tasks in batches
            for (let i = 0; i < config.totalTasks; i += config.batchSize) {
                const batchSize = Math.min(config.batchSize, config.totalTasks - i);
                await this.createTaskBatch(batchSize);
                await new Promise(resolve => setTimeout(resolve, config.batchDelay));
            }

        } catch (error) {
            console.error('Error in default test:', error);
            this.log('Error occurred during default test');
        } finally {
            this.defaultTestInProgress = false;
        }
    }

    async resetThreadPool() {
        // Remove all existing threads
        while (this.threads.length > 0) {
            const thread = this.threads[0];
            if (thread.state === 'running') {
                await new Promise(resolve => setTimeout(resolve, 100));
            } else {
                this.killThread();
            }
        }
        
        // Clear any remaining tasks
        this.taskQueue = [];
        this.queueContainer.innerHTML = '';
        this.completedTasks = 0;
        this.metrics = {
            totalCompletionTime: 0,
            totalQueueTime: 0,
            startTime: null,
            endTime: null,
            threadBusyTime: new Map(),
            lastUpdate: Date.now(),
            isFinalized: false
        };
        this.updateStats();
    }

    async createTaskBatch(batchSize) {
        const batch = [];
        for (let i = 0; i < batchSize; i++) {
            const task = this.createTask();
            batch.push(task);
        }
        return batch;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const threadPool = new ThreadPool(4);

    // Button event listeners
    document.getElementById('startBtn').addEventListener('click', () => {
        const btn = document.getElementById('startBtn');
        if (btn.textContent === 'Start Simulation') {
            threadPool.start();
            btn.textContent = 'Stop Simulation';
        } else {
            threadPool.stop();
            btn.textContent = 'Start Simulation';
        }
    });

    document.getElementById('spawnTaskBtn').addEventListener('click', () => {
        threadPool.createTask();
    });

    document.getElementById('killThreadBtn').addEventListener('click', () => {
        threadPool.killThread();
    });

    document.getElementById('addThreadBtn').addEventListener('click', () => {
        threadPool.createThread();
    });

    document.getElementById('defaultTestBtn').addEventListener('click', () => {
        threadPool.runDefaultTest();
    });
}); 