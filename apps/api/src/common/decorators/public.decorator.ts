import { SetMetadata } from "@nestjs/common";

import { IS_PUBLIC_ROUTE } from "../constants/public-route.constant";

export const Public = () => SetMetadata(IS_PUBLIC_ROUTE, true);
