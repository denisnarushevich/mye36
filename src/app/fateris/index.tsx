import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { majasLocationKey } from "@/app/majas";
import { work } from "@/app/work";
import { SECONDS_IN_HOUR } from "@/app/const";
import { Button } from "@/app/ui/Button";

export const faterisLocationKey = "fateris";

export default function faterisLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(faterisLocationKey));
  map.addEdge(new DirectedEdge(majasLocationKey, faterisLocationKey));
  map.addEdge(new DirectedEdge(faterisLocationKey, majasLocationKey));

  locationActions[faterisLocationKey] = ({ playerState }) => {
    return (
      <Button
        disabled={playerState.tasks.length > 0}
        onClick={() => work(SECONDS_IN_HOUR * 1000 * 2)}
      >
        Šancet ar Fateri
      </Button>
    );
  };
}
