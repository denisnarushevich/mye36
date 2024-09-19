import { Button } from "@/app/ui/Button";
import { setCash, usePlayerStore } from "@/app/player";
import { useState } from "react";

export function BookOfSunButton() {
  const playerState = usePlayerStore((state) => state);

  const [playing, setPlaying] = useState(false);

  return (
    <Button
      disabled={playerState.tasks.length > 0}
      onClick={() => {
        const newCash = playerState.cash - 1;
        setCash(newCash);
        setPlaying(true);
        setTimeout(() => {
          setCash(newCash + 100 * (Math.random() > 0.9 ? 1 : 0));
          setPlaying(false);
        }, 1000);
      }}
    >
      <div>
        {playing && <span className="loading loading-bars loading-xs"></span>}
        <div>Play: Book of Sun</div>
        <div>-1€</div>
      </div>
    </Button>
  );
}
