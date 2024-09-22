import { DirectedEdge, DirectedVertex } from "data-structure-typed";
import { PluginArgs } from "@/app/plugin";
import { Button } from "@/app/ui/Button";
import { work } from "@/app/work";
import { SECONDS_IN_HOUR } from "@/app/const";
import { krustojumsLocationKey } from "@/app/krustojums";

export const majasLocationKey = "majas";

export default function majasLocation({ map, locationActions }: PluginArgs) {
  map.addVertex(new DirectedVertex(majasLocationKey));

  map.addEdge(
    new DirectedEdge(krustojumsLocationKey, majasLocationKey, undefined, {
      distance: 5,
    }),
  );
  map.addEdge(
    new DirectedEdge(majasLocationKey, krustojumsLocationKey, undefined, {
      distance: 5,
    }),
  );

  locationActions[majasLocationKey] = ({ playerState }) => {
    return (
      <Button
        disabled={playerState.tasks.length > 0}
        onClick={() => work(SECONDS_IN_HOUR * 1000 * 2)}
      >
        Šancet ar Fateri
      </Button>
    );
  };
}
