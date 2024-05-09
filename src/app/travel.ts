import {
  isTaskCompletedEvent,
  isTaskStartedEvent,
  scheduleTask,
} from "@/app/tasks";
import { FUEL_CONSUMPTIOM_PER_100_KM, SECONDS_IN_HOUR } from "@/app/const";
import { events } from "@/app/events";
import { Location, places, playerStore } from "@/app/player";

const AVG_KMH = 30;

export function travel(location: Location) {
  const distance = places[location].distance;

  const durationSec = (distance / AVG_KMH) * SECONDS_IN_HOUR;

  scheduleTask({
    name: "travel",
    durationSec,
    from: playerStore.getState().location,
    to: location,
  });
}

events.addEventListener("taskStarted", (e) => {
  if (
    isTaskStartedEvent<{
      from: Location;
      to: Location;
    }>(e)
  ) {
    if (e.detail.name === "travel") {
      playerStore.setState((state) => {
        state.location = undefined;
      });
    }
  }
});

events.addEventListener("taskCompleted", (e) => {
  if (
    isTaskCompletedEvent<{
      from: Location;
      to: Location;
    }>(e)
  ) {
    if (e.detail.name === "travel") {
      const distance = places[e.detail.to].distance;

      playerStore.setState((state) => {
        state.location = e.detail.to;
        state.fuelLiters -= (distance * FUEL_CONSUMPTIOM_PER_100_KM) / 100;
        state.odoKm += distance;
      });
    }
  }
});
