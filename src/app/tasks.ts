import { events } from "@/app/events";
import { isTickEvent, playerStore, Task, worldStore } from "@/app/gameState";

function isTaskCompletedEvent(event: Event): event is CustomEvent<{
  taskId: string;
}> {
  return event.type === "taskCompleted";
}

events.addEventListener("tick", (e) => {
  if (isTickEvent(e)) {
    const timeSeconds = e.detail.timeSeconds;
    const tasks = playerStore.getState().tasks;

    tasks.forEach((task) => {
      const { id, startedAt, duration } = task;

      console.log(timeSeconds, startedAt + duration);
      if (timeSeconds >= startedAt + duration) {
        playerStore.setState(({ tasks }) => {
          tasks.splice(tasks.indexOf(task));
        });

        events.dispatchEvent(
          new CustomEvent("taskCompleted", {
            detail: {
              taskId: id,
            },
          }),
        );
      }
    });
  }
});

let taskIdInc = 0;
export function registerTask(task: Omit<Task, "id" | "startedAt">) {
  const taskId = (taskIdInc++).toString();

  return new Promise<void>((resolve) => {
    playerStore.setState((state) => ({
      ...state,
      tasks: [
        ...state.tasks,
        {
          id: taskId,
          startedAt: worldStore.getState().timeSeconds,
          ...task,
        },
      ],
    }));

    const cb = (e: Event) => {
      if (isTaskCompletedEvent(e) && e.detail.taskId === taskId) {
        events.removeEventListener("taskCompleted", cb);

        resolve();
      }
    };

    events.addEventListener("taskCompleted", cb);
  });
}

export function getCurrentTask() {
  return playerStore.getState().tasks[0];
}

export function taskProgress(taskId: string) {
  const task = playerStore.getState().tasks.find(({ id }) => taskId === id);
  if (task) {
    return (worldStore.getState().timeSeconds - task.startedAt) / task.duration;
  }
}
