import clsx from "clsx";
import {
  FUEL_TANK_CAPACITY_LITERS,
  REFUEL_RATE_LITERS_PER_SECONDS,
} from "@/app/const";
import { MdLocalGasStation } from "react-icons/md";
import numeral from "numeral";
import { worldStore } from "@/app/gameState";
import { useCallback, useState } from "react";
import { useRoutine } from "@/app/useRoutine";
import { playerStore, setCash, usePlayerStore } from "@/app/player";

export function DusButton() {
  const playerState = usePlayerStore((state) => state);

  const [fuelCounter, setFuelCounter] = useState(0);

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
        setFuelCounter((prevState) => prevState + fuelAmount);
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
    setFuelCounter(0);
  }, []);

  return (
    <button
      className={clsx("btn no-animation", "text-white")}
      onPointerDown={handleRefuelStart}
      onPointerUp={handleRefuelStop}
      onPointerOut={handleRefuelStop}
    >
      <MdLocalGasStation className={clsx("w-6 h-6 pointer-events-none")} />
      <div className="text-left">
        <div className="text-base leading-none font-bold">
          {numeral(fuelCounter).format(`0.0`)} L
        </div>
        <div className="pt-1 text-xs leading-none text-gray-300 flex items-center gap-1">
          € {numeral(worldStore.getState().fuelPricePerLiter).format(`0.000`)} /
          L
        </div>
      </div>
    </button>
  );
}
