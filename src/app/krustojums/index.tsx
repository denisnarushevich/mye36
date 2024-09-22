import { DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";

export const krustojumsLocationKey = "krustojums";

export default function krustojumsLocation({
  map,
  locationActions,
}: PluginArgs) {
  map.addVertex(new DirectedVertex(krustojumsLocationKey));
}
