import * as staff from '@/modules/staff/staff-actions'
import * as customer from '@/modules/customer/customer.actions'
import * as installment from '@/modules/installment/installment.actions'
import { themeActions } from './theme.actions'


export const server = {
   theme: themeActions,
   installment,
   customer,
   staff,
};