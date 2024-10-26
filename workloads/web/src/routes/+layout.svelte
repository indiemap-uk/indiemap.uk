<script lang="ts">
	import 'bulma/css/bulma.css'
</script>

<div class="grid">

	<header>
		<h1 class="title is-1">Indiemap</h1>
	</header>

	<main>
	<slot/>
	</main>

	<footer class="footer">
		<div class="content has-text-centered">
			<p>
				<strong>Indiemap.uk</strong>
			</p>
			<p>Made with 🫖 and 🌧️ in Brentwood, Essex.</p>
		</div>
	</footer>

</div>

<style>
.grid {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto 1fr auto;
	height: 100vh;
}
</style>
