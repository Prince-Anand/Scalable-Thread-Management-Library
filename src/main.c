#include "thread_pool.h"  
#include <unistd.h>
#include <stdio.h>  

int main() {  
    ThreadPool pool;  
    init_thread_pool(&pool);  

    // Add tasks to the pool  
    for (int i = 0; i < 10; i++)
    {
        add_task(&pool, i);
        printf("Added task %d to the pool\n", i);
        usleep(500000); // Simulate task creation delay
    } 

    // Wait for tasks to complete  
    usleep(5000000);  // Wait 5 second

    // Shutdown the thread pool
    destroy_thread_pool(&pool);
    printf("Thread pool destroyed.\n");
    printf("All tasks completed.\n");  
    return 0;  
}  