import * as installment from '@/modules/installment/installment-actions'
import * as customer from '@/modules/customer/customer-actions'
import * as staff from '@/modules/staff/staff-actions'
import * as auth from '@/modules/auth/auth-actions'
import { themeActions } from './theme.actions'
import * as product from '@/modules/product/product-actions'
import * as fine from '@/modules/fine/fine-actions';
import * as i18n from '@/modules/i18n/i18n-actions';

export const server = {
   theme: themeActions,
   installment,
   customer,
   product,
   staff,
   auth,
   fine,
   i18n
};