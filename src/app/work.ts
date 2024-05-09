import { isTaskCompletedEvent, scheduleTask } from "@/app/tasks";
import { events } from "@/app/events";
import { addCash } from "@/app/player";

export function work(durationSec: number) {
  scheduleTask({
    name: "work",
    durationSec,
  });
}

events.addEventListener("taskCompleted", (e) => {
  if (isTaskCompletedEvent(e)) {
    if (e.detail.name === "work") {
      addCash(100);
    }
  }
});
