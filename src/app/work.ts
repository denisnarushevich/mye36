import { scheduleTask } from "@/app/tasks";
import { isTickEvent, Task } from "@/app/gameState";
import { playerStore } from "@/app/player";
import { events } from "@/app/events";
import { CASH_PER_HOUR, SECONDS_IN_HOUR, TIME_RATE } from "@/app/const";

type WorkTask = Task & {
  durationMs: number;
  progressMs: number;
};

export function work(durationMs: number) {
  scheduleTask({
    name: "work",
    durationMs,
    progressMs: 0,
  });
}

function isWorkTask(task: Task): task is WorkTask {
  return task.name === "work";
}

events.addEventListener("tick", (e) => {
  if (isTickEvent(e)) {
    const tasks = playerStore.getState().tasks.filter(isWorkTask);

    tasks.forEach(({ ...task }, index) => {
      const progressMs = Math.min(
        task.durationMs,
        task.progressMs + e.detail.deltaTimeMs * TIME_RATE,
      );

      if (progressMs < task.durationMs) {
        playerStore.setState((state) => {
          const _task = state.tasks.find(
            ({ id }) => task.id === id,
          ) as WorkTask;
          _task.progressMs = progressMs;
        });
      } else {
        playerStore.setState((state) => {
          const taskIndex = state.tasks.findIndex(({ id }) => task.id === id);
          state.tasks.splice(taskIndex, 1);
          state.cash +=
            (task.durationMs / 1000 / SECONDS_IN_HOUR) * CASH_PER_HOUR;
        });
      }
    });
  }
});
