import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { majasLocationKey } from "@/app/majas";
import { DusButton } from "@/app/dus/DusButton";

export const dusLocationKey = "dus";

export default function dusLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(dusLocationKey));
  map.addEdge(new DirectedEdge(majasLocationKey, dusLocationKey));
  map.addEdge(new DirectedEdge(dusLocationKey, majasLocationKey));

  locationActions[dusLocationKey] = ({ playerState }) => {
    return <DusButton />;
  };
}
