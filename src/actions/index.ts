import * as websiteActions from '@/modules/website/website.actions'
import * as auth from "@/modules/auth/auth.actions";
import { dashboardActions } from "@/modules/dashboard/dashboard.actions";

export const server = {
    ...auth,
    ...websiteActions,
    dashboardActions
};