<script lang="ts">
import type {BusinessIdType} from '@i/core/business'

import ToggleSuperDebug from '$lib/components/ToggleSuperDebug.svelte'
import {type ProductCRUDListType, type ProductType, ProductSchema} from '@i/core/product'
import IconArrowBackUp from '@tabler/icons-svelte/icons/arrow-back-up'
import IconX from '@tabler/icons-svelte/icons/x'
import {type SuperValidated, superForm} from 'sveltekit-superforms/client'
import * as v from 'valibot'

const {
  businessId,
  sForm,
}: {
  businessId: BusinessIdType
  /** sForm is the superform instance */
  sForm: SuperValidated<ProductCRUDListType>
} = $props()

const {constraints, enhance, errors, form, isTainted, message, reset, tainted} = superForm(sForm, {
  dataType: 'json',
  invalidateAll: 'force',
  resetForm: false,
})

const addProduct = () => {
  $form.newProducts = $form.newProducts.concat({
    businessId,
    originalName: '',
  })
}

// Store original products data for restoration/lookup
let originalProducts: ProductType[] = $form.products.slice()

const deleteProduct = (index: number, id?: string, isNewProduct = false) => {
  if (isNewProduct) {
    const product = $form.newProducts[index]
    const isEmpty = !product.originalName
    if (!isEmpty && !confirm('Unsaved product, there is no undo. Are you sure?')) {
      return
    }
    $form.newProducts = $form.newProducts.filter((_, i) => i !== index)
    return
  }

  if (!id) {
    console.warn('Cannot delete existing product without ID')
    return
  }

  const product = $form.products.find((product) => product.id === id)
  if (!product) {
    console.warn('Product not found for deletion:', id)
    return
  }

  // Remove from products array and add ID to deletedProductIds
  $form.products = $form.products.filter((product) => product.id !== id)
  $form.deletedProductIds = $form.deletedProductIds.concat(id)
}

const restoreProduct = (id: string) => {
  // Find the product in the original data
  const product = originalProducts.find((product) => product.id === id)
  if (!product) {
    console.warn('Cannot restore product, not found in original data:', id)
    return
  }

  // Remove from deletedProductIds and add back to products
  $form.deletedProductIds = $form.deletedProductIds.filter((deletedId) => deletedId !== id)
  $form.products = $form.products.concat(product)
}

// Helper function to get product name by ID
const getProductNameById = (id: string): string => {
  const product = originalProducts.find((product) => product.id === id)
  return product?.originalName ?? `Product ${id}`
}
</script>

{#if $message}
  <div>
    {$message}
  </div>
{/if}

<form method="POST" use:enhance class="admin">
  <input type="hidden" bind:value={$form.businessId} name="businessId" />

  {#if !$form.products.length && !$form.newProducts.length}
    <p>No products yet</p>
  {/if}

  <!-- Existing products -->
  {#each $form.products as _, i}
    <div>
      <input name="id" type="hidden" value={$form.products[i].id} />
      <input name="businessId" type="hidden" value={$form.products[i].businessId} />

      <div class="input-group">
        <input
          name="originalName"
          type="text"
          placeholder="Product name"
          bind:value={$form.products[i].originalName}
          {...$constraints.products?.originalName}
        />
        {#if $errors.products?.[i]?.originalName}
          <span>{$errors.products?.[i]?.originalName}</span>
        {/if}
        <button type="button" onclick={() => deleteProduct(i, $form.products[i].id)}>
          <IconX />
        </button>
      </div>
    </div>
  {/each}

  <!-- New products -->
  {#each $form.newProducts as _, i}
    <div>
      <input name="businessId" type="hidden" value={$form.newProducts[i].businessId} />

      <div class="input-group">
        <input
          name="originalName"
          type="text"
          placeholder="Product name (new)"
          bind:value={$form.newProducts[i].originalName}
          {...$constraints.newProducts?.originalName}
        />
        {#if $errors.newProducts?.[i]?.originalName}
          <span>{$errors.newProducts?.[i]?.originalName}</span>
        {/if}
        <button type="button" onclick={() => deleteProduct(i, undefined, true)}>
          <IconX />
        </button>
      </div>
    </div>
  {/each}

  <div>
    <button type="button" onclick={addProduct}>New product</button>
  </div>

  {#if $form.deletedProductIds.length}
    <p>To be deleted: ({$form.deletedProductIds.length})</p>
  {/if}

  {#each $form.deletedProductIds as deletedId, i}
    <div>
      <div class="input-group">
        <input
          readonly
          type="text"
          placeholder="Product name"
          value={getProductNameById(deletedId)}
        />
        <button
          type="button"
          onclick={() => restoreProduct(deletedId)}
          title="Restore this product"
        >
          <span>
            <IconArrowBackUp />
          </span>
        </button>
      </div>
    </div>
  {/each}

  <div>
    <button disabled={!isTainted($tainted)} type="submit" formaction="?/products">
      Save products
    </button>
    {#if isTainted($tainted)}
      <button type="button" onclick={() => confirm('Sure?') && reset()}>Reset</button>
    {/if}
  </div>
</form>

<ToggleSuperDebug data={$form} />
