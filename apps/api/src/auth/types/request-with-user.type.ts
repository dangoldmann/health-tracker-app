import type { Request } from "express";

import type { ActiveUser } from "./active-user.type";

export type RequestWithUser = Request & {
  user: ActiveUser;
};
