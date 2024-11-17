<script lang="ts">
	import SignOutBar from '$lib/user/SignOutBar.svelte'

	const {data, children} = $props()
</script>

<div class="sticky">
	<header>
		<div class="columns">
			<div class="column">
				<h1 class="title is-1">Indiemap</h1>
			</div>
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

	<main>
		{@render children()}
	</main>

	<footer class="footer">
		<div class="content has-text-centered">
			<p>
				<strong>Indiemap.uk</strong>
			</p>
			<p><span class="is-size-7">Made in Brentwood, Essex ✌️</span></p>
		</div>
	</footer>
</div>

<style>
	.sticky {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;

		header {
			padding-block: 2rem;
			padding-inline: 1rem;
		}
	}
</style>
