import { plannerState } from "./plannerState";
import { TOOLS } from "./plannerConstants";

export const plannerAPI = {

  dispatch(action) {
    switch (action.type) {

      case "SET_TOOL":
        plannerState.activeTool = action.payload;
        break;

      case "SET_WALL_HEIGHT":
        plannerState.wallHeight = action.payload;
        break;

      case "ADD_WALL":
        plannerState.walls.push({
          start: action.payload.start,
          end: action.payload.end,
          height: plannerState.wallHeight
        });
        break;

      case "ADD_ROOM":
        plannerState.rooms.push(action.payload.points);
        break;

      case "ADD_FLOOR":
        plannerState.floors.push(action.payload.shape);
        break;

      case "ADD_OBJECT":
        plannerState.objects.push(action.payload);
        break;

      case "UPLOAD_FLOORPLAN":
        plannerState.floorplanImage = action.payload;
        break;

      default:
        console.warn("Unknown action", action);
    }
  }
};
