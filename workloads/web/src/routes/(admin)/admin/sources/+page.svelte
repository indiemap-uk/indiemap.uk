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

  <ul class="tabs">
    <li class:is-active={data.withBusiness === null}>
      <a href="/admin/sources">Show all</a>
    </li>
    <li class:is-active={data.withBusiness === 'false'}>
      <a href="/admin/sources?withBusiness=false">Without business</a>
    </li>
    <li class:is-active={data.withBusiness === 'true'}>
      <a href="/admin/sources?withBusiness=true">With business</a>
    </li>
  </ul>

  <table class="admin-data-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>URLS</th>
        <th>BUSINESS</th>
        <th>UPDATED</th>
        <th>CREATED</th>
      </tr>
    </thead>
    <tbody>
      {#each data.sources as source}
        <tr>
          <td class="is-family-monospace">
            <a href={`/admin/source/${source.id}`}>
              {source.id}
            </a>
          </td>
          <td>
            {#if source.urls.length}
              <a href={`/admin/source/${source.id}`}>
                {source.urls[0].replace(/https?:\/\//, '').replace(/\/$/, '')}
                {#if source.urls.length > 1}
                  +{source.urls.length - 1}
                {/if}
              </a>
            {:else}
              (no urls)
            {/if}
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
          <td>
            {dayjs().to(dayjs(source.updatedAt))}
          </td>
          <td>
            {dayjs().to(dayjs(source.createdAt))}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
