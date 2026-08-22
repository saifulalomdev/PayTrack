import { dashboardEN } from "./en";
import { dashboardBN } from "./bn";

export const dashboardTranslations = {
  en: dashboardEN,
  bn: dashboardBN,
};

export type DashboardTranslations =
  (typeof dashboardTranslations)[keyof typeof dashboardTranslations];