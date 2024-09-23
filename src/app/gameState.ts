import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { SECONDS_IN_DAY, TICK_MS, TIME_RATE } from "@/app/const";
import { events } from "@/app/events";
import { immer } from "zustand/middleware/immer";
import Noise from "noise-ts";

const noise = new Noise(Math.random());

export type WorldState = {
  startedAtMs?: number;
  fuelPricePerLiter: number;
  tick(dtime: number): void;
};

export type Task = {
  id: number;
  name: string;
};

export const worldStore = createStore<WorldState>()(
  immer((set, getState) => ({
    startedAtMs: undefined,
    fuelPricePerLiter: 1.78,

    tick() {
      const time = getTimeMs();

      const day = Math.floor(time / SECONDS_IN_DAY / 1000);
      const daily0to1 = (noise.simplex2(1, 1 + day / 100) + 1) / 2;

      set((state) => {
        state.fuelPricePerLiter = 1 + 2 * daily0to1;
      });
    },
  })),
);

export function getTimeMs() {
  const { startedAtMs } = worldStore.getState();
  return startedAtMs !== undefined ? (Date.now() - startedAtMs) * TIME_RATE : 0;
}

let timer: number = -1;

export function isTickEvent(event: Event): event is CustomEvent<{
  deltaTimeMs: number;
  deltaGameTimeMs: number;
}> {
  return event.type === "tick";
}

export function start() {
  stop();

  let time0 = Date.now();

  worldStore.setState({
    startedAtMs: time0,
  });

  (function fn(ms = TICK_MS) {
    timer = setTimeout(() => {
      const now = Date.now();
      const deltaTimeMs = now - time0;
      const ms = TICK_MS * 2 - deltaTimeMs;
      time0 = now;

      const { tick } = worldStore.getState();

      tick(deltaTimeMs);

      events.dispatchEvent(
        new CustomEvent("tick", {
          detail: {
            deltaTimeMs,
            deltaGameTimeMs: deltaTimeMs * TIME_RATE,
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
