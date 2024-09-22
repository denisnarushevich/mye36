import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { BookOfSunButton } from "@/app/fenixx/BookOfSunButton";
import { krustojumsLocationKey } from "@/app/krustojums";

export const fenixxLocationKey = "fenixx";

export default function fenixxLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(fenixxLocationKey));

  map.addEdge(
    new DirectedEdge(krustojumsLocationKey, fenixxLocationKey, undefined, {
      distance: 5,
    }),
  );
  map.addEdge(
    new DirectedEdge(fenixxLocationKey, krustojumsLocationKey, undefined, {
      distance: 5,
    }),
  );

  locationActions[fenixxLocationKey] = ({ playerState }) => {
    return <BookOfSunButton />;
  };
}
