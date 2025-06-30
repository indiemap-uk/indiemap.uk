<script>
import {page} from '$app/stores'
</script>

<div class="message is-warning">
  <div class="message-header">
    <p>
      {$page.status}
    </p>
  </div>
  <div class="message-body">
    {$page.error?.message}
  </div>
</div>
