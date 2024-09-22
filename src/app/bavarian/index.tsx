import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { garazasLocationKey } from "@/app/garazas";

export const bavarianLocationKey = "bavarian";

export default function bavarianLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(bavarianLocationKey));

  map.addEdge(
    new DirectedEdge(garazasLocationKey, bavarianLocationKey, undefined, {
      distance: 9,
    }),
  );

  map.addEdge(
    new DirectedEdge(bavarianLocationKey, garazasLocationKey, undefined, {
      distance: 9,
    }),
  );
}
