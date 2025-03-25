#ifndef THREAD_POOL_H
#define THREAD_POOL_H

#include <pthread.h>

#define THREAD_POOL_SIZE 20
#define MAX_TASKS 2000 //100 ko 1000 kr diya

typedef struct
{
    pthread_t threads[THREAD_POOL_SIZE];
    int task_queue[MAX_TASKS];
    int task_count;
    pthread_mutex_t lock;
    pthread_cond_t cond;
    int shutdown;   
    // Shutdown flag
    long total_processed;    //  counter
    size_t peak_queue_usage; //  peak usage tracker
} ThreadPool;

void init_thread_pool(ThreadPool *pool);
void add_task(ThreadPool *pool, int task);
void destroy_thread_pool(ThreadPool *pool);

// Helper function declaration
void print_pool_stats(const ThreadPool *pool);
#endif