import { type SchemaTypeDefinition } from 'sanity'
import { addressType } from './addressType'
import { bannerType } from './bannerType'
import { brandType } from './brandType'
import { categoryType } from './categoryType'
import { orderType } from './orderType'
import { productType } from './productType'
import { userProfileType } from './userProfileType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    productType,
    categoryType,
    brandType,
    bannerType,
    orderType,
    addressType,
    userProfileType,
  ],
}
