import { Button } from "@/app/ui/Button";
import { playerStore, setCash, usePlayerStore } from "@/app/player";
import { useState } from "react";

export function WashButton() {
  const playerState = usePlayerStore((state) => state);

  const [washing, setWashing] = useState(false);

  return (
    <Button
      disabled={playerState.tasks.length > 0}
      onClick={() => {
        const newCash = playerState.cash - 1;
        setCash(newCash);
        playerStore.setState((playerState) => {
          playerState.look += 1;
        });
        setWashing(true);
        setTimeout(() => {
          setWashing(false);
        }, 1000);
      }}
    >
      <div>
        {washing && <span className="loading loading-bars loading-xs"></span>}
        <div>Mazgat</div>
        <div>-1€</div>
      </div>
    </Button>
  );
}
