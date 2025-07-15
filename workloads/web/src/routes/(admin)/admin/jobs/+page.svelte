<script lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {onDestroy, onMount} from 'svelte'

dayjs.extend(relativeTime)

const {data} = $props()

let jobs = $state(data.jobs)
let eventSource: EventSource | null = null

onMount(() => {
  // Connect to SSE stream
  eventSource = new EventSource('/api/jobs/stream')

  eventSource.onmessage = (event) => {
    try {
      jobs = JSON.parse(event.data)
    } catch (error) {
      console.error('Error parsing SSE data:', error)
    }
  }

  eventSource.onerror = (error) => {
    console.error('SSE error:', error)
  }
})

onDestroy(() => {
  if (eventSource) {
    eventSource.close()
  }
})
</script>

<svelte:head>
  <title>Worker Jobs</title>
</svelte:head>

<table class="admin-data-table">
  <thead>
    <tr>
      <th>task</th>
      <th>attempts</th>
      <th>last error</th>
      <th>runs at</th>
      <th>created</th>
      <th>actions</th>
    </tr>
  </thead>
  <tbody>
    {#each jobs ?? [] as job (job.id)}
      <tr>
        <td>#{job.id} {job.task_identifier}</td>
        <td>{job.attempts}</td>
        <td>{job.last_error}</td>
        <td>{dayjs(job.run_at).format('ddd D MMM HH:mm:ss')}</td>
        <td>{dayjs().to(job.created_at)}</td>
        <td>
          <form method="POST" action="?/delete" style="display: inline;">
            <input type="hidden" name="jobId" value={job.id} />
            <button type="submit" onclick={() => confirm('Are you sure you want to delete this job?')}>Delete</button>
          </form>
          <form method="POST" action="?/kill" style="display: inline;">
            <input type="hidden" name="jobId" value={job.id} />
            <button type="submit" onclick={() => confirm('Are you sure you want to kill this job?')}>Kill</button>
          </form>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<form method="POST" action="?/fail" style="display: inline;">
  <button type="submit">Create a failing job for testing</button>
</form>
