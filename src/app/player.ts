import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { FUEL_TANK_CAPACITY_LITERS } from "@/app/const";
import { Task } from "@/app/gameState";
import { useStore } from "zustand";

export const places = {
  majas: {
    distance: 9,
  },
  dus: {
    distance: 5,
  },
  fateris: {
    distance: 10,
    profit: 25,
  },
  ome: {
    distance: 7,
    profit: 10,
  },
  fenixx: {
    distance: 6,
  },
};

export type Location = string;

export type PlayerState = {
  odoKm: number;
  fuelLiters: number;
  cash: number;
  location?: string;
  tasks: Task[];
  addFuel(liters: number): void;
};

export const playerStore = createStore<PlayerState>()(
  immer((set, getState) => ({
    location: "majas",
    fuelLiters: 5,
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
