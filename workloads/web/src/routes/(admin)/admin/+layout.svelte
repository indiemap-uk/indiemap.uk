<script lang="ts">
// Import the main and admin css:
import '$lib/css/index.css'
import '$lib/css/admin/index.css'

import {page} from '$app/stores'
import SignOutBar from '$lib/user/SignOutBar.svelte'
import IconHomeFilled from '@tabler/icons-svelte/icons/home-filled'

import {getFlash} from 'sveltekit-flash-message'

const {children, data} = $props()
const flash = getFlash(page)

let showFlash = $state(true)

// Auto-hide flash message after 5 seconds
$effect(() => {
  if ($flash) {
    showFlash = true
    setTimeout(() => {
      showFlash = false
    }, 5000)
  }
})

const menu = [
  [
    'Business',
    [
      ['List', '/admin/businesses'],
      ['Add', '/admin/business'],
    ],
  ],
  [
    'Source',
    [
      ['List', '/admin/sources'],
      ['Add', '/admin/source'],
    ],
  ],
  [
    'Worker Jobs',
    [
      ['List', '/admin/jobs'],
    ],
  ],
  [
    'Cache',
    [
      ['Manage', '/admin/cache'],
    ],
  ],
]
</script>

<div class="grid">
  <header>
    <nav class="breadcrumb">
      <ul>
        <li>
          <a href="/">
            <IconHomeFilled />
          </a>
        </li>
        <li class:is-active={$page.url.pathname === '/admin'}><a href="/admin">Admin</a></li>
      </ul>
    </nav>

    <SignOutBar
      name={data.session?.user.name ?? data.session?.user.email}
      image={data.session?.user.image ?? data.session?.user.libravatar}
    />
  </header>

  <aside class="menu">
    {#each menu as section}
      <p class="menu-label">{section[0]}</p>
      <ul class="menu-list">
        {#each section[1] as link}
          <li><a href={link[1]} class="plain" class:is-active={link[1] === $page.url.pathname}>{link[0]}</a></li>
        {/each}
      </ul>
    {/each}

    <footer></footer>
  </aside>

  <main>
    <div class="admin-content">
      {#if $flash && showFlash}
        <div class="message">
          {$flash.message}
        </div>
      {/if}
      {@render children()}
    </div>
  </main>
</div>

<style>
.grid {
	display: grid;
	gap: 0;

	grid-template-areas:
		'header header header'
		'nav content content';

	grid-template-columns: 200px 1fr;
	grid-template-rows: auto 1fr auto;

	min-height: 100vh;

	padding: 0;
	margin: 0;
}

header {
	grid-area: header;

	display: flex;
	flex-direction: row;
	justify-content: space-between;

	padding-block: 2rem;
	padding-inline: var(--page-padding-inline);
}

aside {
	grid-area: nav;

	padding-top: 0;
	padding-inline-start: var(--page-padding-inline);

	display: flex;
	flex-direction: column;

	footer {
		position: absolute;
		bottom: 2rem;
	}
}

main {
	grid-area: content;
	padding-inline-end: var(--page-padding-inline);
}
</style>
