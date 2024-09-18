import { useEffect } from "react";
import numeral from "numeral";
import clsx from "clsx";
import { start, useWorldStore } from "@/app/gameState";
import { FUEL_TANK_CAPACITY_LITERS, SECONDS_IN_DAY } from "@/app/const";
import { travel } from "@/app/travel";
import { usePlayerStore } from "@/app/player";
import { locationActions } from "@/app/locationActions";
import { worldMap } from "@/app/worldMap";
import { Button } from "@/app/ui/Button";
import BaseLayout from "@/app/ui/BaseLayout";
import { Car } from "@/app/Car";

export default function Game() {
  const { timeSeconds } = useWorldStore(({ timeSeconds }) => ({
    timeSeconds,
  }));

  const playerState = usePlayerStore((state) => state);

  useEffect(() => {
    start();

    () => {
      stop();
    };
  }, []);

  const busy = playerState.tasks.length > 0;

  return (
    <BaseLayout
      header={<div className="h-16 px-4 flex items-center">My E36</div>}
      overlay={
        <div className="h-full flex flex-col justify-end p-4 items-stretch space-y-4">
          {/*<div className="flex space-x-4 justify-center">*/}
          {/*  <div>{numeral(timeSeconds).format(`0`)}</div>*/}
          {/*</div>*/}
          <div className="flex space-x-4 justify-center">
            <div>{numeral(timeSeconds / SECONDS_IN_DAY).format(`0`)} DAY</div>
          </div>
          <div className="flex space-x-4 justify-center">
            <div
              className={playerState.cash <= 0 ? "text-red-500" : "text-white"}
            >
              € {numeral(playerState.cash).format(`0.00`)}
            </div>
          </div>
          <div className="flex space-x-4 justify-center">
            <div
              className={clsx({
                "text-red-500": playerState.fuelLiters <= 0,
                "text-orange-500":
                  playerState.fuelLiters <= 5 && playerState.fuelLiters > 0,
                "text-white":
                  playerState.fuelLiters > 5 &&
                  playerState.fuelLiters < FUEL_TANK_CAPACITY_LITERS,
                "text-green-400":
                  playerState.fuelLiters == FUEL_TANK_CAPACITY_LITERS,
              })}
            >
              FUEL: {numeral(playerState.fuelLiters).format(`0.0`)} L
            </div>
          </div>
          <div className="flex space-x-4 justify-center">
            <div>ODO: {numeral(playerState.odoKm).format(`000,000`)} KM</div>
          </div>
          <div className="flex space-x-4 justify-center">
            {busy ? (
              <span className="loading loading-bars loading-md"></span>
            ) : (
              playerState.location ?? "somewhere"
            )}
          </div>
          <div className="flex space-x-4 justify-center">
            {playerState.location !== undefined &&
              locationActions[playerState.location]?.({
                playerState,
              })}
          </div>
          <div className="flex space-x-4 justify-center">
            {playerState.location !== undefined &&
              worldMap.getNeighbors(playerState.location).map((vec) => {
                const edge = worldMap.getEdge(playerState.location, vec.key);
                const distance = edge?.value?.distance;

                return (
                  <Button
                    key={vec.key}
                    onClick={() => {
                      travel(vec.key.toString());
                    }}
                  >
                    <div>
                      <div>Uz: {vec.key}</div>
                      <div>{distance}km</div>
                    </div>
                  </Button>
                );
              })}
          </div>
        </div>
      }
    >
      <div className="h-1/2 bg-blue-500" />
      <div className="h-1/2 bg-green-900" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Car speed={playerState.location === undefined ? 1 : 0} />
      </div>
    </BaseLayout>
  );
}
