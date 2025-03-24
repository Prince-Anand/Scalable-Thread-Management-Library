#include "thread_pool.h"  
#include <stdio.h>  
#include <stdlib.h>  

void* worker_thread(void* arg) {  
    ThreadPool *pool = (ThreadPool*) arg;  
    while (1) {  
        pthread_mutex_lock(&pool->lock);  
        if (pool->task_count > 0) {  
            int task = pool->task_queue[--pool->task_count];  
            pthread_mutex_unlock(&pool->lock);  
            printf("Thread %lu executing task %d\n", (unsigned long)pthread_self(), task);  
        } else {  
            pthread_mutex_unlock(&pool->lock);  
        }  
    }  
    return NULL;  
}  

void init_thread_pool(ThreadPool *pool) {  
    pthread_mutex_init(&pool->lock, NULL);  
    pool->task_count = 0;  
    for (int i = 0; i < THREAD_POOL_SIZE; i++) {  
        pthread_create(&pool->threads[i], NULL, worker_thread, pool);  
    }  
}  

void add_task(ThreadPool *pool, int task) {  
    pthread_mutex_lock(&pool->lock);  
    pool->task_queue[pool->task_count++] = task;  
    pthread_mutex_unlock(&pool->lock);  
}  