import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { SECONDS_IN_DAY, TIME_MULTIPLIER_SECONDS } from "@/app/const";
import { events } from "@/app/events";
import { immer } from "zustand/middleware/immer";
import Noise from "noise-ts";

const noise = new Noise(Math.random());

export type WorldState = {
  timeSeconds: number;
  fuelPricePerLiter: number;
  tick(): void;
};

export type Task = {
  id: number;
  name: string;
  startedAt: number;
  durationSec: number;
};

export const worldStore = createStore<WorldState>()(
  immer((set, getState) => ({
    timeSeconds: 0,
    fuelPricePerLiter: 1.78,

    tick() {
      const state = getState();
      const newTimeSeconds = state.timeSeconds + TIME_MULTIPLIER_SECONDS;

      const day = Math.floor(newTimeSeconds / SECONDS_IN_DAY);
      const daily0to1 = (noise.simplex2(0, day / 100) + 1) / 2;

      set((state) => {
        state.timeSeconds = newTimeSeconds;
        state.fuelPricePerLiter = 1 + 2 * daily0to1;
      });
    },
  })),
);

export function getTime() {
  const { timeSeconds } = worldStore.getState();
  return timeSeconds;
}

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

      const { tick } = worldStore.getState();

      tick();

      events.dispatchEvent(
        new CustomEvent("tick", {
          detail: {
            timeSeconds: worldStore.getState().timeSeconds,
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
