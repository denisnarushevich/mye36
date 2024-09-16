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

  return (
    <button
      className={clsx("btn no-animation", {
        "text-red-500": playerState.fuelLiters <= 0,
        "text-orange-500":
          playerState.fuelLiters <= 5 && playerState.fuelLiters > 0,
        "text-white":
          playerState.fuelLiters > 5 &&
          playerState.fuelLiters < FUEL_TANK_CAPACITY_LITERS,
        "text-green-400": playerState.fuelLiters == FUEL_TANK_CAPACITY_LITERS,
      })}
      onPointerDown={handleRefuelStart}
      onPointerUp={handleRefuelStop}
      onPointerOut={handleRefuelStop}
    >
      <MdLocalGasStation className={clsx("w-6 h-6 pointer-events-none")} />
      <div className="text-left">
        <div className="text-base leading-none font-bold">
          {numeral(playerState.fuelLiters).format(`0.0`)} L
        </div>
        <div className="pt-1 text-xs leading-none text-gray-300 flex items-center gap-1">
          € {numeral(worldStore.getState().fuelPricePerLiter).format(`0.000`)} /
          L
        </div>
      </div>
    </button>
  );
}
