import { scheduleTask } from "@/app/tasks";
import {
  AVG_KMH,
  FUEL_CONSUMPTIOM_PER_100_KM,
  SECONDS_IN_HOUR,
  TIME_RATE,
} from "@/app/const";
import { events } from "@/app/events";
import { Location, playerStore } from "@/app/player";
import { isTickEvent, Task } from "@/app/gameState";
import {worldMap} from "@/app/worldMap";

type TravelTask = Task & {
  from: Location;
  to: Location;
  progressKm: number;
};

export function travel(location: Location) {
  const from = playerStore.getState().location;
  if (from !== undefined) {
    scheduleTask({
      name: "travel",
      from: from,
      progressKm: 0,
      to: location,
    });

    playerStore.setState((state) => {
      state.location = undefined;
    });
  }
}

function isTravelTask(task: Task): task is TravelTask {
  return task.name === "travel";
}

events.addEventListener("tick", (e) => {
  if (isTickEvent(e)) {
    const tasks = playerStore.getState().tasks.filter(isTravelTask);

    tasks.forEach(({ ...task }, index) => {

      const edge = worldMap.getEdge(task.from, task.to);
      const distance = edge?.value?.distance;

      if(!distance) throw `invalid distance for edge ${edge}`;

      const dkm = Math.min(
        (((e.detail.deltaTimeMs / 1000) * TIME_RATE) / SECONDS_IN_HOUR) *
          AVG_KMH,
        distance - task.progressKm,
      );
      const dfuel = dkm * (FUEL_CONSUMPTIOM_PER_100_KM / 100);
      const progressKm = Math.min(distance, task.progressKm + dkm);
      // console.log(e.detail.deltaTimeMs);

      if (progressKm < distance) {
        playerStore.setState((state) => {
          const _task = state.tasks.find(
            ({ id }) => task.id === id,
          ) as TravelTask;
          _task.progressKm = progressKm;
          state.fuelLiters -= dfuel;
          state.odoKm += dkm;
        });
      } else {
        playerStore.setState((state) => {
          const taskIndex = state.tasks.findIndex(({ id }) => task.id === id);
          state.tasks.splice(taskIndex, 1);
          state.odoKm += dkm;
          state.location = task.to;
          state.fuelLiters -= dfuel;
        });
      }
    });
  }
});
