import { setupWorker } from "msw/browser";
import { handlers as presenterHandlers } from "./presenterHandlers";
import { handlers as participantHandlers } from "./participantHandlers";

export const worker = setupWorker(
  ...presenterHandlers,
  ...participantHandlers
);