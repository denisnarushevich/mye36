import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { faterisLocationKey } from "@/app/fateris";
import { VisitOmeButton } from "@/app/ome/VisitOmeButton";
import { work } from "@/app/work";
import { SECONDS_IN_HOUR } from "@/app/const";
import { PluginArgs } from "@/app/plugin";

export const omeLocationKey = "ome";

export default function omeLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(omeLocationKey));
  map.addEdge(new DirectedEdge(omeLocationKey, faterisLocationKey));
  map.addEdge(new DirectedEdge(faterisLocationKey, omeLocationKey));

  locationActions[omeLocationKey] = ({ playerState }) => {
    return (
      <VisitOmeButton
        disabled={playerState.tasks.length > 0}
        onClick={() => work(SECONDS_IN_HOUR * 1000)}
      />
    );
  };
}
