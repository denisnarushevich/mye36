import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { majasLocationKey } from "@/app/majas";
import { Button } from "@/app/ui/Button";
import { setCash } from "@/app/player";
import { dusLocationKey } from "@/app/dus";

export const fenixxLocationKey = "fenixx";

export default function fenixxLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(fenixxLocationKey));

  map.addEdge(new DirectedEdge(majasLocationKey, fenixxLocationKey, undefined, {
    distance: 3
  }));
  map.addEdge(new DirectedEdge(fenixxLocationKey, majasLocationKey, undefined, {
    distance: 3
  }));

  map.addEdge(new DirectedEdge(dusLocationKey, fenixxLocationKey, undefined, {
    distance: 5
  }));
  map.addEdge(new DirectedEdge(fenixxLocationKey, dusLocationKey, undefined, {
    distance: 5
  }));

  locationActions[fenixxLocationKey] = ({ playerState }) => {
    return (
      <Button
        disabled={playerState.tasks.length > 0}
        onClick={() =>
          setCash(playerState.cash - 1 + 100 * (Math.random() > 0.9 ? 1 : 0))
        }
      >
        Book of Sun
      </Button>
    );
  };
}
