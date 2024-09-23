import { isTickEvent, Task } from "@/app/gameState";
import { playerStore } from "@/app/player";
import { scheduleTask } from "@/app/tasks";
import { events } from "@/app/events";

const RESTORE_TIME = 5000;

type RestoreTask = Task & {
  startedAt: number;
};

export function restore() {
  scheduleTask({
    name: "restore",
    startedAt: Date.now(),
  });
}

export function isRestoreTask(task: Task): task is RestoreTask {
  return task.name === "restore";
}

events.addEventListener("tick", (e) => {
  if (isTickEvent(e)) {
    const tasks = playerStore.getState().tasks.filter(isRestoreTask);
    tasks.forEach(({ ...task }, index) => {
      if (Date.now() - task.startedAt > RESTORE_TIME) {
        playerStore.setState((state) => {
          state.location = "majas";
          state.fuelLiters = 5;
          const taskIndex = state.tasks.findIndex(({ id }) => task.id === id);
          state.tasks.splice(taskIndex, 1);
        });
      }
    });
  }
});
