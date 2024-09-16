import { ReactComponentLike } from "prop-types";
import { PlayerState } from "@/app/player";
import { ReactNode } from "react";

export const locationActions: Record<
  string,
  (args: { playerState: PlayerState }) => ReactNode
> = {};
