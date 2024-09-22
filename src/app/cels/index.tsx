import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { aplisLocationKey } from "@/app/aplis";

export const celsLocationKey = "cels";

export default function celsLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(celsLocationKey));

  map.addEdge(
    new DirectedEdge(aplisLocationKey, celsLocationKey, undefined, {
      distance: 1,
    }),
  );
  map.addEdge(
    new DirectedEdge(celsLocationKey, aplisLocationKey, undefined, {
      distance: 1,
    }),
  );
}
