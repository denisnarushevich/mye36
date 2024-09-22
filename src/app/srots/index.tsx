import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { garazasLocationKey } from "@/app/garazas";

export const srotsLocationKey = "srots";

export default function srotsLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(srotsLocationKey));

  map.addEdge(
    new DirectedEdge(srotsLocationKey, garazasLocationKey, undefined, {
      distance: 9,
    }),
  );

  map.addEdge(
    new DirectedEdge(garazasLocationKey, srotsLocationKey, undefined, {
      distance: 9,
    }),
  );
}
