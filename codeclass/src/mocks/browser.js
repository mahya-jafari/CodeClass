import { setupWorker } from "msw/browser";
import { handlers as presenterHandlers } from "./presenterHandlers";
import { handlers as participantHandlers } from "./participantHandlers";
import { handlers as adminHandlers } from "./adminHandlers";

export const worker = setupWorker(
  ...presenterHandlers,
  ...participantHandlers,
  ...adminHandlers
);