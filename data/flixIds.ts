import { PlatformKey } from "./platforms";

// Brasil (country id na API v2)
export const FLIX_COUNTRY_BR = "cnt_Yze13ahfd2y6npIiMrwcvRj4";

// company ids opcionais (se você souber). Se null, o app tenta descobrir via /v2/companies.
export const FLIX_COMPANY_ID: Record<PlatformKey, string | null> = {
  netflix: process.env.FLIX_COMPANY_ID_NETFLIX ?? null,
  prime: process.env.FLIX_COMPANY_ID_PRIME ?? null,
  appletv: process.env.FLIX_COMPANY_ID_APPLETV ?? null,
  disney: process.env.FLIX_COMPANY_ID_DISNEY ?? null,
  max: process.env.FLIX_COMPANY_ID_MAX ?? null,
  globoplay: process.env.FLIX_COMPANY_ID_GLOBOPLAY ?? null,
};
