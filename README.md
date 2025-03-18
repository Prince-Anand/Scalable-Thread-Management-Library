<h1 align="center" id="title">Scalable-Thread-Management-Library</h1>

<p align="center"><img src="https://socialify.git.ci/Prince-Anand/Scalable-Thread-Management-Library/image?custom_description=A+scalable+thread+management+library+in+C%2FC%2B%2B+for+high-performance+computing+applications.&amp;description=1&amp;font=Jost&amp;language=1&amp;name=1&amp;owner=1&amp;pattern=Circuit+Board&amp;theme=Dark" alt="project-image"></p>

<p id="description">A scalable thread management library in C/C++ for high-performance computing applications. Supports thread creation synchronization and termination.</p>
---

## Features  
- **Thread Creation and Termination:** Efficiently create and destroy threads using a thread pool to minimize overhead.  
- **Synchronization:** Implements mutexes and semaphores to manage shared resources and prevent race conditions.  
- **Scalability:** Designed to handle thousands of threads, making it suitable for high-performance computing tasks.  

---

## Getting Started  

### Prerequisites (Things that are used to run the Tool) 
- **C/C++ Compiler:** GCC or Clang.  
- **POSIX Threads Library (`pthreads`):** Required for thread management.  

### Installation  
1. **Clone the Repository:**  
   ```bash
   git clone https://github.com/Prince-Anand/Scalable-Thread-Management-Library.git  
   cd Scalable-Thread-Management-Library  

## 2. Compile the Code  
Use the following command to compile the code:
```bash
gcc -o main main.c -lpthread  
```

## 3. Run the Program  
Execute the compiled program:
```bash
./main  
```

---

## Project Structure  
The project is divided into the following modules:

### **Thread Pool**  
Manages a pool of threads to avoid the overhead of creating and destroying threads repeatedly.

#### Example:  
```c
pthread_t threads[10];  
for (int i = 0; i < 10; i++) {  
    pthread_create(&threads[i], NULL, task, NULL);  
}  
```

### **Synchronization**  
Uses mutexes and semaphores to handle shared resources safely.

#### Example:  
```c
pthread_mutex_t lock;  
pthread_mutex_init(&lock, NULL);  
pthread_mutex_lock(&lock);  
// Critical section  
pthread_mutex_unlock(&lock);  
```

### **Scalability Testing**  
Stress-tests the library with 1,000+ threads to ensure it can handle high loads.

---

## Usage  
To use the library in your project:

### Include the header file:  
```c
#include "thread_manager.h"  
```

### Create threads using the thread pool:  
```c
create_thread(task_function);  
```

### Synchronize threads using mutexes:  
```c
lock_mutex();  
// Access shared resources  
unlock_mutex();  
```

---

## Testing  
The library has been tested with the following tools:
- **Valgrind**: For memory leak detection.
- **GDB**: For debugging thread-related issues.
- **GoogleTest**: For unit testing individual modules.

### To run tests:  
```bash
gcc -o test test.c -lpthread  
./test  
```

---

## Contributing  
Contributions are welcome! If you’d like to contribute:

### 1. Fork the repository.  

### 2. Create a new branch:  
```bash
git checkout -b feature/your-feature-name  
```

### 3. Commit your changes:  
```bash
git commit -m "feat: Add your feature"  
```

### 4. Push to the branch:  
```bash
git push origin feature/your-feature-name  
```

### 5. Open a pull request.

---
