<script lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const {data} = $props()
</script>

<svelte:head>
  <title>Sources</title>
</svelte:head>

<div class="block">
  <h1 class="title">Sources</h1>

  <table class="admin-data-table">
    <thead>
      <tr>
        <th>UPDATED</th>
        <th>CREATED</th>
        <th>ID</th>
        <th>URLS</th>
        <th>BUSINESS</th>
      </tr>
    </thead>
    <tbody>
      {#each data.sources as source}
        <tr>
          <td>
            {dayjs().to(dayjs(source.updatedAt))}
          </td>
          <td>
            {dayjs().to(dayjs(source.createdAt))}
          </td>
          <td class="is-family-monospace">
            <a href={`/admin/source/${source.id}`}>
              {source.id}
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
            {#if source.business}
              <a href={`/admin/business/${source.business.id}`} class="tag is-info">
                {source.business.name}
              </a>
            {:else}
              <em>-</em>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
