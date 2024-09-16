import majasLocation from "@/app/majas";
import { worldMap } from "@/app/worldMap";
import { locationActions } from "@/app/locationActions";
import faterisLocation from "@/app/fateris";
import omeLocation from "@/app/ome";
import dusLocation from "@/app/dus";
import fenixxLocation from "@/app/fenixx";

majasLocation({ map: worldMap, locationActions });
dusLocation({ map: worldMap, locationActions });
fenixxLocation({ map: worldMap, locationActions });
faterisLocation({ map: worldMap, locationActions });
omeLocation({ map: worldMap, locationActions });
