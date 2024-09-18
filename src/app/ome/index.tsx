import {DirectedEdge, DirectedVertex} from "data-structure-typed";
import {VisitOmeButton} from "@/app/ome/VisitOmeButton";
import {work} from "@/app/work";
import {SECONDS_IN_HOUR} from "@/app/const";
import {PluginArgs} from "@/app/plugin";
import {majasLocationKey} from "@/app/majas";

export const omeLocationKey = "ome";

export default function omeLocation({map, locationActions}: PluginArgs) {
    map.addVertex(new DirectedVertex(omeLocationKey));
    map.addEdge(new DirectedEdge(omeLocationKey, majasLocationKey, undefined, {
        distance: 3
    }));
    map.addEdge(new DirectedEdge(majasLocationKey, omeLocationKey, undefined, {
        distance: 3
    }));

    locationActions[omeLocationKey] = ({playerState}) => {
        return (
            <VisitOmeButton
                disabled={playerState.tasks.length > 0}
                onClick={() => work(SECONDS_IN_HOUR * 1000)}
            />
        );
    };
}
