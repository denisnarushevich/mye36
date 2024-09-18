import {DirectedEdge, DirectedGraph, DirectedVertex} from "data-structure-typed";
import { ReactComponentLike } from "prop-types";

export const worldMap = new DirectedGraph<any, any, DirectedVertex, DirectedEdge<{distance: number}>>();
