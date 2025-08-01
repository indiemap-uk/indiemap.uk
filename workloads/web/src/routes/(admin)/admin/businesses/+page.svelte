<script lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const {data} = $props()
</script>

<svelte:head>
  <title>Businesses</title>
</svelte:head>

<div class="block">
  <h1 class="title">Businesses</h1>

  <ul class="tabs">
    <li class:is-active={data.status === null}>
      <a href="/admin/businesses">Show all</a>
    </li>
    <li class:is-active={data.status === 'live'}>
      <a href="/admin/businesses?status=live">Live</a>
    </li>
    <li class:is-active={data.status === 'draft'}>
      <a href="/admin/businesses?status=draft">Draft</a>
    </li>
  </ul>

  <table class="admin-data-table">
    <thead>
      <tr>
        <th>NAME</th>
        <th>TOWN</th>
        <th>STATUS</th>
        <th>CREATED</th>
        <th>UPDATED</th>
      </tr>
    </thead>
    <tbody>
      {#each data.businesses as business}
        <tr>
          <td class="is-family-monospace">
            <a href={`/admin/business/${business.id.toString()}`}>
              <strong>{business.name}</strong>
            </a>
          </td>
          <td>
            {#if business.town}
              {business.town.name}, {business.town.county}
            {:else}
              <em>-</em>
            {/if}
          </td>
          <td>{business.status}</td>
          <td>
            {dayjs().to(dayjs(business.createdAt))}
          </td>
          <td>
            {dayjs().to(dayjs(business.updatedAt))}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
