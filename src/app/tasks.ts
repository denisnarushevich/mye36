import { playerStore } from "@/app/player";

let taskLastId = 0;

export function scheduleTask<T extends { name: string }>(task: T) {
  const id = taskLastId++;

  return new Promise<void>((resolve) => {
    playerStore.setState((state) => {
      state.tasks.push({
        id,
        ...task,
      });
    });
  });
}
