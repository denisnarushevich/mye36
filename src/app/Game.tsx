import BaseLayout from "@/app/BaseLayout";
import { useCallback, useEffect, useState } from "react";
import numeral from "numeral";
import { useRoutine } from "@/app/useRoutine";
import clsx from "clsx";
import { start, useWorldStore, worldStore } from "@/app/gameState";
import { MdLocalGasStation } from "react-icons/md";
import {
  FUEL_TANK_CAPACITY_LITERS,
  REFUEL_RATE_LITERS_PER_SECONDS,
  SECONDS_IN_HOUR,
} from "@/app/const";
import { travel } from "@/app/travel";
import { playerStore, setCash, usePlayerStore } from "@/app/player";
import { work } from "@/app/work";

export default function Game() {
  const { timeSeconds } = useWorldStore(({ timeSeconds }) => ({
    timeSeconds,
  }));

  const playerState = usePlayerStore((state) => state);

  const [refueling, setRefueling] = useState(false);

  useRoutine(
    (stop, delayMs) => {
      if (refueling) {
        const state = playerState;
        const worldState = worldStore.getState();

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
          requiredFuelAmount * worldState.fuelPricePerLiter,
          state.cash,
        );
        const fuelAmount = fuelCost / worldState.fuelPricePerLiter;

        const money = Math.max(
          0,
          Math.round(
            (state.cash - fuelAmount * worldState.fuelPricePerLiter) * 100,
          ) / 100,
        );

        const _state = playerStore.getState();
        setCash(money);
        _state.addFuel(fuelAmount);
      } else {
        stop();
      }
    },
    100,
    [playerState, refueling],
  );

  const handleRefuelStart = useCallback(() => {
    setRefueling(true);
  }, []);

  const handleRefuelStop = useCallback(() => {
    setRefueling(false);
  }, []);

  const handleGoToWork = useCallback(() => {
    travel("father");

    work(SECONDS_IN_HOUR * 3);

    travel("home");
  }, []);

  useEffect(() => {
    start();

    () => {
      stop();
    };
  }, []);

  const { tasks, location } = usePlayerStore((state) => state);

  const busy = tasks.length > 0;

  return (
    <BaseLayout
      header={<div className="h-16 px-4 flex items-center">My E36</div>}
      overlay={
        <div className="h-full flex flex-col justify-end p-4 items-stretch space-y-4">
          <div className="flex space-x-4 justify-center">
            <div>{timeSeconds}</div>
          </div>
          <div className="flex space-x-4 justify-center">
            <div>
              {numeral(worldStore.getState().timeSeconds / 86400).format(`0`)}{" "}
              DAY
            </div>
          </div>
          <div className="flex space-x-4 justify-center">
            <div>{playerState.location ?? "somewhere"}</div>
          </div>
          <div className="flex space-x-4 justify-center">
            <div
              className={playerState.cash <= 0 ? "text-red-500" : "text-white"}
            >
              € {numeral(playerState.cash).format(`0.00`)}
            </div>
          </div>
          <div className="flex space-x-4 justify-center">
            <div>ODO: {numeral(playerState.odoKm).format(`000,000`)} KM</div>
          </div>
          <div className="flex space-x-4 justify-center">
            <button
              className={clsx("btn no-animation", {
                "text-red-500": playerState.fuelLiters <= 0,
                "text-orange-500":
                  playerState.fuelLiters <= 5 && playerState.fuelLiters > 0,
                "text-white":
                  playerState.fuelLiters > 5 &&
                  playerState.fuelLiters < FUEL_TANK_CAPACITY_LITERS,
                "text-green-400":
                  playerState.fuelLiters == FUEL_TANK_CAPACITY_LITERS,
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
                  {numeral(playerState.fuelLiters).format(`0.0`)} L
                </div>
                <div className="pt-1 text-xs leading-none text-gray-300 flex items-center gap-1">
                  €{" "}
                  {numeral(worldStore.getState().fuelPricePerLiter).format(
                    `0.000`,
                  )}{" "}
                  / L
                </div>
              </div>
            </button>
          </div>
          <div className="flex space-x-4 justify-center">
            {busy && <span className="loading loading-bars loading-md"></span>}
          </div>
          <div className="flex space-x-4 justify-center">
            <button
              className={clsx("btn no-animation", {
                "btn-disabled": busy,
              })}
              onClick={!busy ? handleGoToWork : () => void 0}
            >
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
            transform: `rotate(${playerState.odoKm * 190}deg)`,
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
