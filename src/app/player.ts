import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { FUEL_TANK_CAPACITY_LITERS } from "@/app/const";
import { Task } from "@/app/gameState";
import { useStore } from "zustand";

export type Location = string;

export type PlayerState = {
  odoKm: number;
  fuelLiters: number;
  cash: number;
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
