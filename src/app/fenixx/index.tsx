import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { majasLocationKey } from "@/app/majas";
import { Button } from "@/app/ui/Button";
import { setCash } from "@/app/player";
import { dusLocationKey } from "@/app/dus";
import { useState } from "react";
import { BookOfSunButton } from "@/app/fenixx/BookOfSunButton";

export const fenixxLocationKey = "fenixx";

export default function fenixxLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(fenixxLocationKey));

  map.addEdge(
    new DirectedEdge(majasLocationKey, fenixxLocationKey, undefined, {
      distance: 100,
    }),
  );
  map.addEdge(
    new DirectedEdge(fenixxLocationKey, majasLocationKey, undefined, {
      distance: 100,
    }),
  );

  map.addEdge(
    new DirectedEdge(dusLocationKey, fenixxLocationKey, undefined, {
      distance: 5,
    }),
  );
  map.addEdge(
    new DirectedEdge(fenixxLocationKey, dusLocationKey, undefined, {
      distance: 5,
    }),
  );

  locationActions[fenixxLocationKey] = ({ playerState }) => {
    return <BookOfSunButton />;
  };
}
