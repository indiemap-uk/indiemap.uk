<script lang="ts">
	import CountyLink from "$lib/county/CountyLink.svelte";
	import TownLink from "$lib/town/TownLink.svelte";
	import type { BusinessResolvedType } from "@i/core/business";

	const { business }: { business: BusinessResolvedType } = $props();
</script>

<a href={`/business/${business.id}`}>{business.name}</a>
{#if business.town}
	in <TownLink id={business.town.id} name={business.town.name} />, <CountyLink
		name={business.town.county}
	/>
{:else if business.county}
	in <CountyLink name={business.county} />
{/if}
