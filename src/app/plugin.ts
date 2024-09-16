import { DirectedGraph } from "data-structure-typed";
import { PlayerState } from "@/app/player";
import { ReactNode } from "react";

export type PluginArgs = {
  map: DirectedGraph;
  locationActions: Record<
    string,
    (args: { playerState: PlayerState }) => ReactNode
  >;
};
