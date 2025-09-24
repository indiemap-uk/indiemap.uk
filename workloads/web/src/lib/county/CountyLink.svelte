<script lang="ts">
const {name} = $props()
</script>

<a href="/county/{encodeURIComponent(name)}">{name}</a>
