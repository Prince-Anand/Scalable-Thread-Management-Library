#include "thread_pool.h"  
#include <stdio.h>  

void test_thread_pool() {  
    ThreadPool pool;  
    init_thread_pool(&pool);  

    // Add tasks to the pool  
    for (int i = 0; i < 10; i++) {  
        add_task(&pool, i);  
    }  

    // Wait for tasks to complete  
    sleep(5);  

    printf("All tasks completed.\n");  
}  

int main() {  
    test_thread_pool();  
    return 0;  
}  