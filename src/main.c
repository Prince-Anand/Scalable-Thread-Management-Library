#include "thread_pool.h"  
#include <unistd.h>  

int main() {  
    ThreadPool pool;  
    init_thread_pool(&pool);  

    // Add tasks to the pool  
    for (int i = 0; i < 10; i++) {  
        add_task(&pool, i);  
    }  

    // Wait for tasks to complete  
    sleep(5);  

    printf("All tasks completed.\n");  
    return 0;  
}  