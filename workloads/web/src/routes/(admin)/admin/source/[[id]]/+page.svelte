<script lang="ts">
import SourceForm from '$lib/source/SourceForm.svelte'

const {data} = $props()
</script>

<SourceForm sForm={data.sourceForm} business={data.source?.business} notes={data.notes} />
