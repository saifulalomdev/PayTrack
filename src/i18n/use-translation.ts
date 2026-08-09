// i18n/use-translation.ts
import { dictionaries, type Locale, type Namespace } from "./index";
import get from "lodash.get";

export function getTranslator<N extends Namespace>(locale: Locale, ns: N) {
  const dict = dictionaries[locale][ns];
  return (key: string) => {
    const value = get(dict, key);
    if (value === undefined && import.meta.env.DEV) {
      console.warn(`[i18n] Missing key "${key}" in namespace "${ns}" (${locale})`);
    }
    return value ?? key;
  };
}