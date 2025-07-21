import type {BusinessType} from '@i/core/business'
import {type ProductCreateType, type ProductType, ProductCRUDListSchema} from '@i/core/product'
import {fail, redirect} from '@sveltejs/kit'
import {valibot} from 'sveltekit-superforms/adapters'
import {message, superValidate} from 'sveltekit-superforms/server'

import type {Actions, PageServerLoad} from './$types'

export const load: PageServerLoad = async ({locals, parent}) => {
  const {business}: {business?: BusinessType | null} = await parent()

  if (!business) {
    throw redirect(301, '/admin/businesses')
  }

  const products = (await locals.container.productService.getByBusinessId(business.id)) ?? []
  const formData = {
    businessId: business.id,
    deletedProductIds: [],
    products,
    newProducts: [],
  }
  const form = await superValidate(formData, valibot(ProductCRUDListSchema))

  return {form}
}

export const actions = {
  products: async ({locals, request}) => {
    const form = await superValidate(request, valibot(ProductCRUDListSchema))

    if (!form.valid) {
      console.error('error in products form', form.errors)
      return fail(400, {form})
    }

    try {
      // Update existing products
      if (form.data.products?.length) {
        await Promise.all(
          form.data.products.map((product) => locals.container.productService.update(product as ProductType)),
        )
      }

      // Create new products
      if (form.data.newProducts?.length) {
        await Promise.all(
          form.data.newProducts.map((product) => locals.container.productService.create(product as ProductCreateType)),
        )
      }

      // Delete products by ID
      if (form.data.deletedProductIds?.length) {
        await Promise.all(
          form.data.deletedProductIds.map((id) => locals.container.productService.delete(id)),
        )
      }
    } catch (e) {
      console.error(e)
      return fail(500, {form})
    }

    return message(form, 'Products saved')
  },
} satisfies Actions
