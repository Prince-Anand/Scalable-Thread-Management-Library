#include "thread_pool.h"
#include <stdio.h>
#include <time.h>
#include <unistd.h>

#define STRESS_TEST_TASKS 1000

int main()
{
	ThreadPool pool;
	init_thread_pool(&pool);
	time_t start = time(NULL);

	// Add tasks without delays
	for (int i = 0; i < STRESS_TEST_TASKS; i++)
	{
		add_task(&pool, i);
		if (i % 100 == 0)
			printf("Added task %d\n", i); // Progress indicator
	}

	// Wait for queue to empty
	while (pool.task_count > 0)
	{
		usleep(100000); // Check every 100ms
	}

	print_pool_stats(&pool);
	destroy_thread_pool(&pool);

	double duration = difftime(time(NULL), start);
	printf("Completed %d tasks in %.2fs (%.1f tasks/s)\n",
		   STRESS_TEST_TASKS, duration, STRESS_TEST_TASKS / duration);

	printf("\n=== Performance Summary ===\n");
	printf("Tasks completed: %ld/%d\n", pool.total_processed, STRESS_TEST_TASKS);
	printf("Peak queue usage: %zu/%d\n", pool.peak_queue_usage, MAX_TASKS);
	return 0;
}