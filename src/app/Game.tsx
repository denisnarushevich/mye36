import { useEffect } from "react";
import numeral from "numeral";
import clsx from "clsx";
import { getTimeMs, start } from "@/app/gameState";
import { FUEL_TANK_CAPACITY_LITERS, SECONDS_IN_DAY } from "@/app/const";
import { isTravelTask, travel } from "@/app/travel";
import { playerStore, usePlayerStore } from "@/app/player";
import { locationActions } from "@/app/locationActions";
import { worldMap } from "@/app/worldMap";
import { Button } from "@/app/ui/Button";
import BaseLayout from "@/app/ui/BaseLayout";
import { Car } from "@/app/Car";
import { restore } from "@/app/restore";

export default function Game() {
  const timeSeconds = getTimeMs();

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
          <div className="flex space-x-4 justify-center">
            <div>
              {numeral(timeSeconds / 1000 / SECONDS_IN_DAY).format(`0`)} DAY
            </div>
          </div>
          <div className="flex space-x-4 justify-center">
            <div
              className={playerState.cash <= 0 ? "text-red-500" : "text-white"}
            >
              € {numeral(playerState.cash).format(`0.00`)}
            </div>
          </div>
          <div className="flex space-x-4 justify-center">
            <Button
              key="smscredit"
              onClick={() => {
                playerStore.setState((state) => {
                  state.cash += 100;
                  state.loan += 100;
                });
              }}
            >
              <div>
                <div>MMS Credit</div>
                <div>+100</div>
              </div>
            </Button>
            <Button
              key="smscredit-repay"
              onClick={() => {
                playerStore.setState((state) => {
                  if (state.loan >= 10 && state.cash >= 10) {
                    state.cash -= 10;
                    state.loan -= 10;
                  }
                });
              }}
            >
              <div>
                <div>MMS Credit</div>
                <div>-10</div>
              </div>
            </Button>
          </div>
          <div className="flex space-x-4 justify-center">
            <div
              className={playerState.cash <= 0 ? "text-red-500" : "text-white"}
            >
              Look: {playerState.look}
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
            {playerState.fuelLiters <= 0 && (
              <Button
                key="nofuel"
                onClick={() => {
                  restore();
                }}
              >
                <div>
                  <div>Zvanit Sencim</div>
                </div>
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="h-1/2 bg-gradient-to-t from-indigo-800 to-indigo-950" />
      <div className="h-1/2 bg-gradient-to-t from-slate-900 to-slate-800" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Car speed={playerState.tasks.find(isTravelTask) ? 1 : 0} />
      </div>
    </BaseLayout>
  );
}
