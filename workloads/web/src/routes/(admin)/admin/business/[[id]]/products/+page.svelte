<script lang="ts">
import ProductsForm from '$lib/products/ProductsForm.svelte'

const {data} = $props()
</script>

{#if data.business}
  <ProductsForm businessId={data.business.id} sForm={data.form} />
{/if}
