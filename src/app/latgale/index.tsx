import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { celsLocationKey } from "@/app/cels";

export const latgaleLocationKey = "latgale";

export default function latgaleLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(latgaleLocationKey));

  map.addEdge(
    new DirectedEdge(latgaleLocationKey, celsLocationKey, undefined, {
      distance: 200,
    }),
  );
  map.addEdge(
    new DirectedEdge(celsLocationKey, latgaleLocationKey, undefined, {
      distance: 200,
    }),
  );
}
