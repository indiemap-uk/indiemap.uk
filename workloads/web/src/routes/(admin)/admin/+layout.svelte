<script lang="ts">
	import {page} from '$app/stores'
	import SignOutBar from '$lib/user/SignOutBar.svelte'
	import {IconHomeFilled} from '@tabler/icons-svelte'

	const {data, children} = $props()

	const menu = [
		[
			'Business',
			[
				['List', '/admin/businesses'],
				['Add', '/admin/business'],
			],
		],
	]
</script>

<div class="grid">
	<header>
		<div class="columns">
			<nav class="column breadcrumb">
				<ul>
					<li>
						<a href="/">
							<IconHomeFilled />
						</a>
					</li>
					<li class:is-active={$page.url.pathname === '/admin'}><a href="/admin">Admin</a></li>
				</ul>
			</nav>

			<div class="column has-text-right level">
				<div class="level-left"></div>
				<div class="level-right">
					<SignOutBar
						name={data.session?.user.name ?? data.session?.user.email}
						image={data.session?.user.image ?? data.session?.user.libravatar}
					/>
				</div>
			</div>
		</div>
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

		<footer></footer>
	</aside>

	<main>
		<div class="container">
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

		padding-block: 2rem;
		padding-inline: 1rem;
	}

	aside {
		grid-area: nav;

		padding-top: 0;
		padding-inline: 1rem;

		display: flex;
		flex-direction: column;

		footer {
			position: absolute;
			bottom: 2rem;
		}
	}

	main {
		grid-area: content;
	}
</style>
