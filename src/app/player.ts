import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import {
  FUEL_TANK_CAPACITY_LITERS,
  LOAN_30DAY_INTEREST,
  SECONDS_IN_DAY,
} from "@/app/const";
import { getTimeMs, isTickEvent, Task } from "@/app/gameState";
import { useStore } from "zustand";
import { events } from "@/app/events";

export type Location = string;

export type PlayerState = {
  odoKm: number;
  fuelLiters: number;
  cash: number;
  loan: number;
  loanInterest: number;
  look: number;
  location?: string;
  tasks: Task[];
  addFuel(liters: number): void;
};

export const playerStore = createStore<PlayerState>()(
  immer((set, getState) => ({
    location: "majas",
    fuelLiters: 5,
    look: 0,
    loan: 0,
    loanInterest: 0,
    odoKm: 372943,
    cash: 100,
    tasks: [],
    addFuel(liters: number) {
      set((state) => {
        state.fuelLiters = Math.min(
          state.fuelLiters + liters,
          FUEL_TANK_CAPACITY_LITERS,
        );
      });
    },
  })),
);

export function addCash(amount: number) {
  playerStore.setState((state) => {
    state.cash = Math.max(0, state.cash + amount);
  });
}

export function setCash(amount: number) {
  playerStore.setState((state) => {
    state.cash = Math.max(0, amount);
  });
}

export const usePlayerStore = <U>(selector: (state: PlayerState) => U) =>
  useStore(playerStore, selector);

events.addEventListener("tick", (e) => {
  if (isTickEvent(e)) {
    const playerState = playerStore.getState();
    if (playerState.loan > 0) {
      const interestPercent =
        e.detail.deltaGameTimeMs *
        (LOAN_30DAY_INTEREST / 30 / SECONDS_IN_DAY / 1000);

      const interest = playerState.loan * interestPercent;

      playerStore.setState((state) => {
        state.cash -= interest;
      });
    }
  }
});
