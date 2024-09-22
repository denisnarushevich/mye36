import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { aplisLocationKey } from "@/app/aplis";
import { krustojumsLocationKey } from "@/app/krustojums";
import { WashButton } from "@/app/deputo/WashButton";

export const deputoLocationKey = "deputo";

export default function deputoLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(deputoLocationKey));

  map.addEdge(
    new DirectedEdge(aplisLocationKey, deputoLocationKey, undefined, {
      distance: 7,
    }),
  );

  map.addEdge(
    new DirectedEdge(deputoLocationKey, aplisLocationKey, undefined, {
      distance: 7,
    }),
  );

  map.addEdge(
    new DirectedEdge(krustojumsLocationKey, deputoLocationKey, undefined, {
      distance: 7,
    }),
  );

  map.addEdge(
    new DirectedEdge(deputoLocationKey, krustojumsLocationKey, undefined, {
      distance: 7,
    }),
  );

  locationActions[deputoLocationKey] = ({ playerState }) => {
    return <WashButton />;
  };
}
