import { DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";

export const majasLocationKey = "majas";

export default function majasLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(majasLocationKey));
}
