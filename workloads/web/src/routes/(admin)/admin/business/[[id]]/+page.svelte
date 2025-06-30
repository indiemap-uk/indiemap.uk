<script lang="ts">
import BusinessForm from '$lib/business/BusinessForm.svelte'

const {data} = $props()
</script>

<BusinessForm sForm={data.businessForm} town={data.business?.town} />
