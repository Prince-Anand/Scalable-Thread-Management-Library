#ifndef THREAD_POOL_H  
#define THREAD_POOL_H  

#include <pthread.h>  

#define THREAD_POOL_SIZE 5  
#define MAX_TASKS 100  

typedef struct {  
    pthread_t threads[THREAD_POOL_SIZE];  
    int task_queue[MAX_TASKS];  
    int task_count;  
    pthread_mutex_t lock;  
} ThreadPool;  

void init_thread_pool(ThreadPool *pool);  
void add_task(ThreadPool *pool, int task);  

#endif  