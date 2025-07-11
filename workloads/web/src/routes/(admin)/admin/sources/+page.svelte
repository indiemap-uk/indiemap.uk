<script lang="ts">
const {data} = $props()
</script>

<svelte:head>
  <title>Sources</title>
</svelte:head>

<div class="block">
  <h1 class="title">Sources</h1>

  <table class="table is-striped is-hoverable is-fullwidth">
    <thead>
      <tr>
        <th>ID</th>
        <th>URLS</th>
        <th>BUSINESS ID</th>
        <th>ACTIONS</th>
      </tr>
    </thead>
    <tbody>
      {#each data.sources as source}
        <tr>
          <td class="is-family-monospace">
            <a href={`/admin/source/${source.id}`}>
              <strong>{source.id}</strong>
            </a>
          </td>
          <td>
            <div class="content">
              {#each source.urls as url}
                <div class="is-size-7">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                  </a>
                </div>
              {/each}
            </div>
          </td>
          <td>
            {#if source.businessId}
              <a href={`/admin/business/${source.businessId}`} class="tag is-info">
                {source.businessId}
              </a>
            {:else}
              <em>-</em>
            {/if}
          </td>
          <td>
            <a href={`/admin/source/${source.id}`} class="button is-small is-primary">
              Edit
            </a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
