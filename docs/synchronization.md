# Synchronization Mechanisms  

## Synchronization  
The library uses mutexes to protect shared resources and prevent race conditions.  
- **Mutex:** Ensures only one thread can access the task queue at a time.  
- **Semaphore:** Limits the number of threads accessing the task queue simultaneously.  

## Mutex  
A mutex (mutual exclusion) is used to protect shared resources from concurrent access.  
- **Usage:**  
  - `pthread_mutex_lock(&lock)` to acquire the lock.  
  - `pthread_mutex_unlock(&lock)` to release the lock.  

## Semaphore  
A semaphore is used to limit the number of threads accessing a resource simultaneously.  
- **Usage:**  
  - `sem_wait(&semaphore)` to decrement the semaphore.  
  - `sem_post(&semaphore)` to increment the semaphore.  