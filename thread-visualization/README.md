# Thread Management Library Visualization

An interactive web-based visualization demonstrating the behavior of a high-performance thread management library. This project provides an educational interface to understand concepts like thread pools, task queuing, and synchronization.

## Features

- Visual representation of thread pool and task queue
- Real-time animation of task assignment and execution
- Thread state visualization (idle, running, waiting, terminated)
- Interactive controls for spawning tasks and managing threads
- Live status updates and logging panel

## Project Structure

- `index.html` - Main application interface
- `styles.css` - CSS styling and animations
- `threadSimulator.js` - Core simulation logic
- `README.md` - Documentation

## Setup

Simply open `index.html` in a modern web browser. No build process or dependencies required.

## Usage

1. Click "Start Simulation" to initialize the thread pool
2. Use "Spawn Task" to add new tasks to the queue
3. Watch as threads pick up and process tasks
4. Experiment with "Kill Thread" to see how the pool adapts
5. Monitor the log panel for detailed status updates

## States

- 🔵 Blue: Idle thread
- 🟢 Green: Running task
- 🟡 Yellow: Waiting (mutex/condition)
- 🔴 Red: Terminated 