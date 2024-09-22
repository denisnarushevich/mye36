import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { DusButton } from "@/app/dus/DusButton";
import { aplisLocationKey } from "@/app/aplis";

export const dusLocationKey = "dus";

export default function dusLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(dusLocationKey));
  map.addEdge(
    new DirectedEdge(aplisLocationKey, dusLocationKey, undefined, {
      distance: 7,
    }),
  );
  map.addEdge(
    new DirectedEdge(dusLocationKey, aplisLocationKey, undefined, {
      distance: 7,
    }),
  );

  locationActions[dusLocationKey] = ({ playerState }) => {
    return <DusButton />;
  };
}
