#include "thread_pool.h"
#include <stdio.h>
#include <stdlib.h>
#include <windows.h>

void *worker_thread(void *arg)
{
    ThreadPool *pool = (ThreadPool *)arg;
    while (1)
    {
        pthread_mutex_lock(&pool->lock);

        // Wait for tasks if the queue is empty
        while (pool->task_count == 0)
        {
            pthread_cond_wait(&pool->cond, &pool->lock);
        }

        // Get ONE task from the queue
        int task = pool->task_queue[--pool->task_count];

        // Notify other threads that a task has been taken
        pthread_cond_broadcast(&pool->cond);

        pthread_mutex_unlock(&pool->lock);

        // Execute the task
        printf("Thread %lu executing task %d\n", (unsigned long)pthread_self(), task);

        // Simulate task execution time
        Sleep(1000);
    }
    return NULL;
}

void init_thread_pool(ThreadPool *pool)
{
    pthread_mutex_init(&pool->lock, NULL);
    pthread_cond_init(&pool->cond, NULL);
    pool->task_count = 0;

    // Create worker threads
    for (int i = 0; i < THREAD_POOL_SIZE; i++)
    {
        pthread_create(&pool->threads[i], NULL, worker_thread, pool);
    }
}

void add_task(ThreadPool *pool, int task)
{
    pthread_mutex_lock(&pool->lock);

    // Add the task to the queue
    pool->task_queue[pool->task_count++] = task;

    // Notify all waiting threads
    pthread_cond_broadcast(&pool->cond);

    pthread_mutex_unlock(&pool->lock);
}