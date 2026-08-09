import * as en from "./locales/en/index";
import * as bn from "./locales/bn/index";

export const dictionaries = { en, bn } as const;
export type Locale = keyof typeof dictionaries;
export type Namespace = keyof typeof en;