#include "thread_pool.h"
#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#include <time.h>
#include <unistd.h>

void *worker_thread(void *arg)
{
    ThreadPool *pool = (ThreadPool *)arg;
    while (1)
    {
        pthread_mutex_lock(&pool->lock);

        // Wait for tasks if the queue is empty
        while (pool->task_count == 0 && !pool->shutdown)
        {
            pthread_cond_wait(&pool->cond, &pool->lock);
        }

        // Check for shutdown signal
        if (pool->shutdown)
        {
            pthread_mutex_unlock(&pool->lock);
            pthread_exit(NULL);
        }

        // Safely get task from queue
        int task = pool->task_queue[--pool->task_count];
        pthread_mutex_unlock(&pool->lock);

        printf("Thread %lu executing task %d\n", (unsigned long)pthread_self(), task);
        usleep(500000 + (rand() % 1000000));  // 500ms-1500ms work
    }
    return NULL;
}

void init_thread_pool(ThreadPool *pool)
{
    int ret;
    pool->task_count = 0;
    pool->shutdown = 0;
    srand((unsigned int)time(NULL));

    if ((ret = pthread_mutex_init(&pool->lock, NULL)) != 0) {
        fprintf(stderr, "Mutex init failed: %d\n", ret);
        exit(EXIT_FAILURE);
    }
    
    if ((ret = pthread_cond_init(&pool->cond, NULL)) != 0) {
        fprintf(stderr, "Cond init failed: %d\n", ret);
        pthread_mutex_destroy(&pool->lock);
        exit(EXIT_FAILURE);
    }

    for (int i = 0; i < THREAD_POOL_SIZE; i++)
    {
        if ((ret = pthread_create(&pool->threads[i], NULL, worker_thread, pool)) != 0) 
        {
            fprintf(stderr, "Thread create failed: %d\n", ret);
            
            // Cleanup already created threads
            pthread_mutex_lock(&pool->lock);
            pool->shutdown = 1;
            pthread_cond_broadcast(&pool->cond);
            pthread_mutex_unlock(&pool->lock);
            
            for (int j = 0; j < i; j++) {
                pthread_join(pool->threads[j], NULL);
            }
            
            pthread_mutex_destroy(&pool->lock);
            pthread_cond_destroy(&pool->cond);
            exit(EXIT_FAILURE);
        }
    }
}

void add_task(ThreadPool *pool, int task)
{
    pthread_mutex_lock(&pool->lock);
    
    if (pool->task_count >= MAX_TASKS) {
        fprintf(stderr, "Task queue full! Dropping task %d\n", task);
        pthread_mutex_unlock(&pool->lock);
        return;
    }
    
    pool->task_queue[pool->task_count++] = task;
    pthread_cond_signal(&pool->cond); // More efficient than broadcast
    pthread_mutex_unlock(&pool->lock);
}

void destroy_thread_pool(ThreadPool *pool)
{
    pthread_mutex_lock(&pool->lock);
    pool->shutdown = 1;
    pthread_cond_broadcast(&pool->cond);
    pthread_mutex_unlock(&pool->lock);

    for (int i = 0; i < THREAD_POOL_SIZE; i++) {
        if (pthread_join(pool->threads[i], NULL) != 0) {
            perror("Failed to join thread");
        }
    }

    pthread_mutex_destroy(&pool->lock);
    pthread_cond_destroy(&pool->cond);
}