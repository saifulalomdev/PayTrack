import { dashboardEn } from "./en";
import { dashboardBn } from "./bn";

export const dashboardTranslations = {
  en: dashboardEn,
  bn: dashboardBn,
};

export type DashboardTranslations =
  (typeof dashboardTranslations)[keyof typeof dashboardTranslations];