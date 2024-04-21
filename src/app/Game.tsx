import BaseLayout from "@/app/BaseLayout";
import { useCallback, useReducer } from "react";
import numeral from "numeral";
import { useRoutine } from "@/app/useRoutine";
import clsx from "clsx";

type GameState = {
    odoKm: number;
    fuelLiters: number;
    money: number;
    speed: number;
    timeSeconds: number;
    fuelPricePerLiter: number;
    broken: boolean;
};

enum GameActionType {
    DRIVE,
    REFUEL,
    UPDATE,
    REPAIR,
}

type GameAction =
    | {
          type: GameActionType.DRIVE;
      }
    | {
          type: GameActionType.REFUEL;
      }
    | {
          type: GameActionType.REPAIR;
      }
    | {
          type: GameActionType.UPDATE;
          dtimeSeconds: number;
      };

const SECONDS_IN_DAY = 86400;
const SALARY_PERIOD = SECONDS_IN_DAY * 30;
const TIME_MULTIPLIER_SECONDS = SECONDS_IN_DAY;
const FUEL_CONSUMPTIOM_PER_100_KM = 10;
const FUEL_TANK_CAPACITY_LITERS = 60;
const SALARY_AMOUNT = 110;
const REPAIR_COST = 100;
const BREAK_CHANCE = 0.01;

function reducer(state: GameState, action: GameAction) {
    if (action.type === GameActionType.DRIVE) {
        if (Math.random() <= BREAK_CHANCE) {
            return {
                ...state,
                broken: true,
            };
        }

        if (!state.broken) {
            const kmTravelled = 1;
            const fuelConsumed = (kmTravelled / 100) * FUEL_CONSUMPTIOM_PER_100_KM;

            if (state.fuelLiters >= fuelConsumed) {
                return {
                    ...state,
                    odoKm: state.odoKm + kmTravelled,
                    fuelLiters: Math.max(0, Math.round((state.fuelLiters - fuelConsumed) * 100) / 100),
                };
            } else {
                return state;
            }
        }

        return state;
    }

    if (action.type === GameActionType.REFUEL) {
        const requiredFuelAmount = FUEL_TANK_CAPACITY_LITERS - state.fuelLiters;
        const fuelCost = Math.min(requiredFuelAmount * state.fuelPricePerLiter, state.money);
        const fuelAmount = fuelCost / state.fuelPricePerLiter;

        return {
            ...state,
            fuelLiters: state.fuelLiters + fuelAmount,
            money: Math.max(0, Math.round((state.money - fuelAmount * state.fuelPricePerLiter) * 100) / 100),
        };
    }

    if (action.type === GameActionType.REPAIR) {
        if (state.broken && state.money >= REPAIR_COST) {
            return {
                ...state,
                broken: false,
                money: Math.max(0, Math.round((state.money - REPAIR_COST) * 100) / 100),
            };
        }
        return state;
    }

    if (action.type === GameActionType.UPDATE) {
        const newTimeSeconds = state.timeSeconds + action.dtimeSeconds * TIME_MULTIPLIER_SECONDS;
        const salaryDay = Math.floor(newTimeSeconds / SALARY_PERIOD) - Math.floor(state.timeSeconds / SALARY_PERIOD);
        const daily = Math.floor(newTimeSeconds / SECONDS_IN_DAY) - Math.floor(state.timeSeconds / SECONDS_IN_DAY);

        return {
            ...state,
            timeSeconds: newTimeSeconds,
            money: state.money + SALARY_AMOUNT * salaryDay,
            fuelPricePerLiter: Math.max(state.fuelPricePerLiter + ((Math.random() * 2 - 1) / 10) * daily, 1.5),
        };
    }

    throw Error("Unknown action.");
}

export default function Game() {
    const [state, dispatch] = useReducer(reducer, {
        odoKm: 72943,
        fuelLiters: 5,
        money: 15,
        speed: 0,
        timeSeconds: 0,
        fuelPricePerLiter: 1.78,
        broken: false,
    });

    const handleDrive = useCallback(() => {
        dispatch({
            type: GameActionType.DRIVE,
        });
    }, []);

    const handleRefuel = useCallback(() => {
        dispatch({
            type: GameActionType.REFUEL,
        });
    }, []);

    const handleRepair = useCallback(() => {
        dispatch({
            type: GameActionType.REPAIR,
        });
    }, []);

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
                        <div>FUEL PRICE: {numeral(state.fuelPricePerLiter).format(`0.00`)} EUR / L</div>
                    </div>
                    <div className="flex space-x-4 justify-center">
                        <div className={state.money <= 0 ? "text-red-500" : "text-white"}>
                            MONEY: {numeral(state.money).format(`0.00`)} EUR
                        </div>
                        <div>SALARY: {numeral(SALARY_AMOUNT).format(`0.00`)} EUR / 30 DAYS</div>
                    </div>
                    <div className="flex space-x-4 justify-center">
                        {state.broken && <div className="text-red-500">BROKEN</div>}
                        <div>ODO: {numeral(state.odoKm).format(`000,000`)} KM</div>
                        <div className={state.fuelLiters <= 0 ? "text-red-500" : "text-white"}>
                            FUEL: {numeral(state.fuelLiters).format(`0.0`)} L
                        </div>
                    </div>
                    <div className="flex space-x-4 justify-center">
                        {!state.broken ? (
                            <button className="btn no-animation" onClick={handleDrive}>
                                Drive
                            </button>
                        ) : (
                            <button
                                className={clsx("btn no-animation", {
                                    "btn-disabled": state.money < REPAIR_COST,
                                })}
                                onClick={handleRepair}
                            >
                                {`Repair (-${REPAIR_COST} EUR)`}
                            </button>
                        )}
                        <button className="btn no-animation" onClick={handleRefuel}>
                            Refuel
                        </button>
                    </div>
                </div>
            }
        >
            <div className="h-1/2 bg-blue-500" />
            <div className="h-1/2 bg-green-900" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className={clsx("h-[64px] w-[64px] rounded-full border-8 border-black overflow-hidden")}
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
