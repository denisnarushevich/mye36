import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { majasLocationKey } from "@/app/majas";
import { dusLocationKey } from "@/app/dus";
import { BookOfSunButton } from "@/app/fenixx/BookOfSunButton";

export const zurkburgerLocationKey = "zurkburger";
export const krustojumsLocationKey = "krustojums";

export default function zurkburgerLocation({
  map,
  locationActions,
}: PluginArgs) {
  map.addVertex(new DirectedVertex(zurkburgerLocationKey));
  map.addVertex(new DirectedVertex(krustojumsLocationKey));

  map.addEdge(
    new DirectedEdge(krustojumsLocationKey, zurkburgerLocationKey, undefined, {
      distance: 10,
    }),
  );
  map.addEdge(
    new DirectedEdge(zurkburgerLocationKey, krustojumsLocationKey, undefined, {
      distance: 10,
    }),
  );

  map.addEdge(
    new DirectedEdge(dusLocationKey, krustojumsLocationKey, undefined, {
      distance: 5,
    }),
  );
  map.addEdge(
    new DirectedEdge(krustojumsLocationKey, dusLocationKey, undefined, {
      distance: 5,
    }),
  );
}
