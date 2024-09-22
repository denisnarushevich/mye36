import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { aplisLocationKey } from "@/app/aplis";

export const zurkburgerLocationKey = "zurkburger";

export default function zurkburgerLocation({
  map,
  locationActions,
}: PluginArgs) {
  map.addVertex(new DirectedVertex(zurkburgerLocationKey));

  map.addEdge(
    new DirectedEdge(aplisLocationKey, zurkburgerLocationKey, undefined, {
      distance: 5,
    }),
  );
  map.addEdge(
    new DirectedEdge(zurkburgerLocationKey, aplisLocationKey, undefined, {
      distance: 5,
    }),
  );
}
