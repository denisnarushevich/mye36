import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { FUEL_TANK_CAPACITY_LITERS } from "@/app/const";
import { Task } from "@/app/gameState";
import { useStore } from "zustand";

export const places = {
  home: {
    distance: 9,
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

export type PlayerState = {
  odoKm: number;
  fuelLiters: number;
  cash: number;
  location?: Location;
  tasks: Task[];
  addFuel(liters: number): void;
};

export const playerStore = createStore<PlayerState>()(
  immer((set, getState) => ({
    location: "home",
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
