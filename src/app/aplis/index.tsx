import { DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";

export const aplisLocationKey = "aplis";

export default function aplisLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(aplisLocationKey));
}
