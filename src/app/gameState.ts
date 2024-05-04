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
