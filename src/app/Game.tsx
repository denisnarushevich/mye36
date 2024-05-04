import BaseLayout from "@/app/BaseLayout";
import { useCallback, useMemo, useReducer, useRef, useState } from "react";
import numeral from "numeral";
import { useRoutine } from "@/app/useRoutine";
import clsx from "clsx";
import Noise from "noise-ts";
import { GameState, Location, places } from "@/app/gameState";
import { MdLocalGasStation } from "react-icons/md";
import { useAsyncFn } from "react-use";

const noise = new Noise(Math.random());

enum GameActionType {
  DRIVE,
  ADD_FUEL,
  UPDATE,
  REPAIR,
  GO_TO,
  GO_TO_WORK,
  SET_CASH,
  WORK,
}

type GameAction =
  | {
      type: GameActionType.DRIVE;
      distanceKm: number;
    }
  | {
      type: GameActionType.ADD_FUEL;
      liters: number;
    }
  | {
      type: GameActionType.REPAIR;
    }
  | {
      type: GameActionType.SET_CASH;
      amount: number;
    }
  | {
      type: GameActionType.GO_TO;
      place: Location;
    }
  | {
      type: GameActionType.WORK;
    }
  | {
      type: GameActionType.UPDATE;
      dtimeSeconds: number;
    };

const SECONDS_IN_DAY = 86400;
const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SALARY_PERIOD = SECONDS_IN_DAY * 30;
const TIME_MULTIPLIER_SECONDS = SECONDS_IN_HOUR;
const FUEL_CONSUMPTIOM_PER_100_KM = 10;
const FUEL_TANK_CAPACITY_LITERS = 60;
const REFUEL_RATE_LITERS_PER_SECONDS = 1;
const SALARY_AMOUNT = 110;
const REPAIR_COST = 100;
const BREAK_CHANCE = 0.01;

function reducer(state: GameState, action: GameAction) {
  if (action.type === GameActionType.ADD_FUEL) {
    return {
      ...state,
      fuelLiters: Math.min(
        state.fuelLiters + action.liters,
        FUEL_TANK_CAPACITY_LITERS,
      ),
    };
  }

  if (action.type === GameActionType.REPAIR) {
    if (state.broken && state.cash >= REPAIR_COST) {
      return {
        ...state,
        broken: false,
        cash: Math.max(0, Math.round((state.cash - REPAIR_COST) * 100) / 100),
      };
    }
    return state;
  }

  if (action.type === GameActionType.UPDATE) {
    const newTimeSeconds =
      state.timeSeconds + action.dtimeSeconds * TIME_MULTIPLIER_SECONDS;

    const daily =
      Math.floor(newTimeSeconds / SECONDS_IN_DAY) -
      Math.floor(state.timeSeconds / SECONDS_IN_DAY);

    const day = Math.floor(newTimeSeconds / SECONDS_IN_DAY);
    const daily0to1 = (noise.simplex2(0, day / 100) + 1) / 2;

    return {
      ...state,
      timeSeconds: newTimeSeconds,
      fuelPricePerLiter: 1 + 2 * daily0to1,
    };
  }

  if (action.type === GameActionType.SET_CASH) {
    return {
      ...state,
      cash: Math.max(0, action.amount),
    };
  }

  if (action.type === GameActionType.GO_TO) {
    const distance = places[action.place].distance;
    const enoughFuel =
      (distance * FUEL_CONSUMPTIOM_PER_100_KM) / 100 <= state.fuelLiters;

    if (!enoughFuel) return state;

    return {
      ...state,
      location: action.place as Location,
      fuelLiters:
        state.fuelLiters -
        (places[action.place].distance * FUEL_CONSUMPTIOM_PER_100_KM) / 100,
      odoKm: state.odoKm + distance,
    };
  }

  throw Error("Unknown action.");
}

export default function Game() {
  const [state, dispatch] = useReducer(reducer, {
    odoKm: 372943,
    fuelLiters: 5.7,
    cash: 101,
    speed: 0,
    timeSeconds: 0,
    fuelPricePerLiter: 1.78,
    broken: false,
    location: "home",
    goingTo: undefined,
    busy: undefined,
    action: undefined,
  });

  const [refueling, setRefueling] = useState(false);

  const [refuelTimer, setRefuelTimer] =
    useState<ReturnType<typeof setInterval>>();

  useRoutine(
    (stop, delayMs) => {
      if (refueling) {
        if (
          state.fuelLiters === FUEL_TANK_CAPACITY_LITERS ||
          state.cash === 0
        ) {
          setRefueling(false);
          stop();
        }

        const requiredFuelAmount = Math.min(
          (REFUEL_RATE_LITERS_PER_SECONDS * delayMs) / 1000,
          FUEL_TANK_CAPACITY_LITERS - state.fuelLiters,
        );
        const fuelCost = Math.min(
          requiredFuelAmount * state.fuelPricePerLiter,
          state.cash,
        );
        const fuelAmount = fuelCost / state.fuelPricePerLiter;

        const money = Math.max(
          0,
          Math.round(
            (state.cash - fuelAmount * state.fuelPricePerLiter) * 100,
          ) / 100,
        );

        dispatch({
          type: GameActionType.SET_CASH,
          amount: money,
        });

        dispatch({
          type: GameActionType.ADD_FUEL,
          liters: fuelAmount,
        });
      } else {
        stop();
      }
    },
    100,
    [refueling, state.cash, state.fuelLiters, state.fuelPricePerLiter],
  );
  // console.log(status);
  const handleRefuel = useCallback(() => {
    setRefueling(!refueling);
  }, [refueling]);

  const handleRefuelStart = useCallback(() => {
    setRefueling(true);
  }, []);

  const handleRefuelStop = useCallback(() => {
    setRefueling(false);
  }, []);

  const handleRepair = useCallback(() => {
    dispatch({
      type: GameActionType.REPAIR,
    });
  }, []);

  const [{ loading: working }, work] = useAsyncFn(async () => {
    const distance = places.father.distance;
    const enoughFuel =
      (distance * FUEL_CONSUMPTIOM_PER_100_KM) / 100 <= state.fuelLiters;

    if (enoughFuel) {
      return new Promise((resolve) => {
        setTimeout(() => {
          dispatch({
            type: GameActionType.GO_TO,
            place: "father",
          });

          setTimeout(() => {
            dispatch({
              type: GameActionType.SET_CASH,
              amount: state.cash + places.father.profit,
            });

            setTimeout(() => {
              dispatch({
                type: GameActionType.GO_TO,
                place: "home",
              });

              resolve(void 0);
            }, 3000);
          }, 3000);
        }, 1000);
      });
    }
  }, [dispatch, state.cash]);

  const handleGoToWork = useCallback(() => {
    work();
  }, [work]);

  useRoutine((stop, dtime, now) => {
    dispatch({
      type: GameActionType.UPDATE,
      dtimeSeconds: dtime / 1000,
    });
  }, 200);

  return (
    <BaseLayout
      header={<div className="h-16 px-4 flex items-center">My E36</div>}
      overlay={
        <div className="h-full flex flex-col justify-end p-4 items-stretch space-y-4">
          <div className="flex space-x-4 justify-center">
            <div>{numeral(state.timeSeconds / 86400).format(`0`)} DAY</div>
          </div>
          <div className="flex space-x-4 justify-center">
            <div>{state.location}</div>
          </div>
          <div className="flex space-x-4 justify-center">
            <div className={state.cash <= 0 ? "text-red-500" : "text-white"}>
              $: {numeral(state.cash).format(`0.00`)} EUR
            </div>
          </div>
          <div className="flex space-x-4 justify-center">
            {state.broken && <div className="text-red-500">BROKEN</div>}
            <div>ODO: {numeral(state.odoKm).format(`000,000`)} KM</div>
          </div>
          <div className="flex space-x-4 justify-center">
            {state.broken && (
              <button
                className={clsx("btn no-animation", {
                  "btn-disabled": state.cash < REPAIR_COST,
                })}
                onClick={handleRepair}
              >
                {`Repair (-${REPAIR_COST} EUR)`}
              </button>
            )}
            <button
              className={clsx("btn no-animation", {
                "text-red-500": state.fuelLiters <= 0,
                "text-orange-500":
                  state.fuelLiters <= 5 && state.fuelLiters > 0,
                "text-white":
                  state.fuelLiters > 5 &&
                  state.fuelLiters < FUEL_TANK_CAPACITY_LITERS,
                "text-green-400": state.fuelLiters == FUEL_TANK_CAPACITY_LITERS,
              })}
              onPointerDown={handleRefuelStart}
              onPointerUp={handleRefuelStop}
              onPointerOut={handleRefuelStop}
            >
              <MdLocalGasStation
                className={clsx("w-6 h-6 pointer-events-none")}
              />
              <div className="text-left">
                <div className="text-base leading-none font-bold">
                  {numeral(state.fuelLiters).format(`0.0`)} L
                </div>
                <div className="pt-1 text-xs leading-none text-gray-300 flex items-center gap-1">
                  € {numeral(state.fuelPricePerLiter).format(`0.000`)} / L
                </div>
              </div>
            </button>
          </div>
          <div className="flex space-x-4 justify-center">
            <button
              className={clsx("btn no-animation", {
                "btn-active": working,
              })}
              onClick={!working ? handleGoToWork : () => void 0}
            >
              {working && (
                <span className="loading loading-bars loading-md"></span>
              )}
              Šancet ar Fateri
            </button>
          </div>
        </div>
      }
    >
      <div className="h-1/2 bg-blue-500" />
      <div className="h-1/2 bg-green-900" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={clsx(
            "h-[64px] w-[64px] rounded-full border-8 border-black overflow-hidden",
          )}
          style={{
            transition: "transform 100ms ease",
            transform: `rotate(${state.odoKm * 190}deg)`,
          }}
        >
          <div className="h-1/2 flex">
            <div className="w-1/2 h-full bg-white" />
            <div className="w-1/2 h-full bg-blue-700" />
          </div>
          <div className="h-1/2 flex">
            <div className="w-1/2 h-full bg-blue-700" />
            <div className="w-1/2 h-full bg-white" />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
