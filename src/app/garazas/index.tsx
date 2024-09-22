import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { majasLocationKey } from "@/app/majas";

export const garazasLocationKey = "garazas";

export default function garazasLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(garazasLocationKey));

  map.addEdge(
    new DirectedEdge(majasLocationKey, garazasLocationKey, undefined, {
      distance: 9,
    }),
  );

  map.addEdge(
    new DirectedEdge(garazasLocationKey, majasLocationKey, undefined, {
      distance: 9,
    }),
  );
}
