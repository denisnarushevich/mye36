import { events } from "@/app/events";
import { getTime, isTickEvent } from "@/app/gameState";
import { playerStore } from "@/app/player";

export function isTaskCompletedEvent<T>(event: Event): event is CustomEvent<
  T & {
    id: number;
    name: string;
  }
> {
  return event.type === "taskCompleted";
}

export function isTaskStartedEvent<T>(event: Event): event is CustomEvent<
  T & {
    id: number;
    name: string;
  }
> {
  return event.type === "taskStarted";
}

events.addEventListener("tick", (e) => {
  if (isTickEvent(e)) {
    const timeSeconds = e.detail.timeSeconds;
    const tasks = playerStore.getState().tasks;

    tasks.forEach(({ startedAt, durationSec, ...task }) => {
      if (timeSeconds >= startedAt + durationSec) {
        playerStore.setState(({ tasks }) => {
          tasks.shift();
        });

        events.dispatchEvent(
          new CustomEvent("taskCompleted", {
            detail: task,
          }),
        );
      } else if (timeSeconds >= startedAt) {
        events.dispatchEvent(
          new CustomEvent("taskStarted", {
            detail: task,
          }),
        );
      }
    });
  }
});

let taskLastId = 0;

export function scheduleTask<T extends { name: string; durationSec: number }>(
  task: T,
) {
  const id = taskLastId++;

  return new Promise<void>((resolve) => {
    playerStore.setState((state) => {
      const lastTask = state.tasks[state.tasks.length - 1];

      state.tasks.push({
        id,
        ...task,
        startedAt:
          lastTask !== undefined
            ? lastTask.startedAt + lastTask.durationSec
            : getTime(),
      });
    });

    const cb = (e: Event) => {
      if (isTaskCompletedEvent(e) && e.detail.id === id) {
        events.removeEventListener("taskCompleted", cb);

        resolve();
      }
    };

    events.addEventListener("taskCompleted", cb);
  });
}
