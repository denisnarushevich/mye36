import { useEffect } from "react";
import numeral from "numeral";
import clsx from "clsx";
import { start, useWorldStore } from "@/app/gameState";
import { SECONDS_IN_DAY } from "@/app/const";
import { travel } from "@/app/travel";
import { usePlayerStore } from "@/app/player";
import { locationActions } from "@/app/locationActions";
import { worldMap } from "@/app/worldMap";
import { Button } from "@/app/ui/Button";
import BaseLayout from "@/app/ui/BaseLayout";

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
            <div>FUEL: {numeral(playerState.fuelLiters).format(`0.0`)} L</div>
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
                return (
                  <Button
                    key={vec.key}
                    onClick={() => {
                      travel(vec.key.toString());
                    }}
                  >
                    Uz: {vec.key}
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
