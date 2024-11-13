<div class="sticky">
	<header>
		<h1 class="title is-1">Indiemap</h1>
	</header>

	<main>
		<slot />
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
	}
</style>
