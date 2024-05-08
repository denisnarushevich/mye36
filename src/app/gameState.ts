import { createStore, StoreApi } from "zustand/vanilla";
import { useStore, create } from "zustand";
import { SECONDS_IN_HOUR, TIME_MULTIPLIER_SECONDS } from "@/app/const";
import { events } from "@/app/events";
import { immer } from "zustand/middleware/immer";

export const places = {
  home: {
    distance: 0,
  },
  father: {
    distance: 10,
    profit: 25,
  },
  grandma: {
    distance: 7,
    profit: 10,
  },
  spot: {
    distance: 5,
  },
};

export type Location = keyof typeof places;

export type GameState = {
  odoKm: number;
  fuelLiters: number;
  cash: number;
  speed: number;
  timeSeconds: number;
  fuelPricePerLiter: number;
  broken: boolean;
  location: Location;
  goingTo:
    | {
        location: Location;
        arriveAt: number;
      }
    | undefined;
  busy: number | undefined;
  action: undefined | "WORK_WITH_FATHER" | "VISIT_GRANDMA" | "GO_TO_SPOT";
};

export type WorldState = {
  timeSeconds: number;
  tick(): void;
};

export type TaskType = "GO_TO";

export type Task = {
  id: string;
  type: TaskType;
  startedAt: number;
  duration: number;
};

export type PlayerState = {
  location: Location;
  tasks: Task[];
};

export const playerStore = createStore<PlayerState>()(
  immer((set, getState) => ({
    location: "home",
    tasks: [],
  })),
);

export const worldStore = createStore<WorldState>((set, getState) => ({
  timeSeconds: 0,
  tick() {
    const { timeSeconds } = getState();

    set({
      timeSeconds: timeSeconds + 1,
    });
  },
}));

let timer: number = -1;

export function isTickEvent(event: Event): event is CustomEvent<{
  timeSeconds: number;
}> {
  return event.type === "tick";
}

const TICK_MS = 1000;
export function start() {
  stop();

  let time0 = Date.now();
  (function fn(ms = TICK_MS) {
    timer = setTimeout(() => {
      const now = Date.now();
      const dtime = now - time0;
      const ms = TICK_MS * 2 - dtime;
      time0 = now;

      const { timeSeconds } = worldStore.getState();

      worldStore.setState({
        timeSeconds: timeSeconds + TIME_MULTIPLIER_SECONDS,
      });

      events.dispatchEvent(
        new CustomEvent("tick", {
          detail: {
            timeSeconds: timeSeconds + TIME_MULTIPLIER_SECONDS,
          },
        }),
      );

      fn(ms);
    }, ms) as any;
  })();
}

export function stop() {
  clearTimeout(timer);
}

export const useWorldStore = <U>(selector: (state: WorldState) => U) =>
  useStore(worldStore, selector);

export const usePlayerStore = <U>(selector: (state: PlayerState) => U) =>
  useStore(playerStore, selector);
