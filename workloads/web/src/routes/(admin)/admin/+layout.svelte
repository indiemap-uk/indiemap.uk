<script lang="ts">
	import {page} from '$app/stores'
	import {IconHomeFilled} from '@tabler/icons-svelte'

	const menu = [
		[
			'Business',
			[
				['List', '/admin/business'],
				['Add', '/admin/business/add'],
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
	</header>

	<aside class="menu">
		{#each menu as section}
			<p class="menu-label">{section[0]}</p>
			<ul class="menu-list">
				{#each section[1] as link}
					<li><a href={link[1]} class:is-active={link[1] === $page.url.pathname}>{link[0]}</a></li>
				{/each}
			</ul>
		{/each}

		<button class="button is-small">Log out</button>
	</aside>

	<main>
		<div class="container">
			<slot />
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

		height: 100vh;

		padding: 0;
		margin: 0;
	}

	header {
		grid-area: header;

		padding-block: 2rem;
		padding-inline: 1rem;
	}

	aside {
		grid-area: nav;

		padding-top: 0;
		padding-inline: 1rem;

		display: flex;
		flex-direction: column;

		.logo {
			width: 150px;
		}

		button {
			position: absolute;
			bottom: 2rem;
		}
	}

	main {
		grid-area: content;
	}
</style>
