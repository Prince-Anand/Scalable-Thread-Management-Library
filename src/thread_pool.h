#ifndef THREAD_POOL_H
#define THREAD_POOL_H

#include <pthread.h>

#define THREAD_POOL_SIZE 5
#define MAX_TASKS 100

typedef struct
{
    pthread_t threads[THREAD_POOL_SIZE];
    int task_queue[MAX_TASKS];
    int task_count;
    pthread_mutex_t lock;
    pthread_cond_t cond;
    int shutdown;   
    // Shutdown flag
} ThreadPool;

void init_thread_pool(ThreadPool *pool);
void add_task(ThreadPool *pool, int task);
void destroy_thread_pool(ThreadPool *pool);

#endif