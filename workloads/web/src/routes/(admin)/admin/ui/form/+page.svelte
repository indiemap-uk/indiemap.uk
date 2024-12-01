<script>
	import {fakerEN_GB as faker} from '@faker-js/faker'
	import Autocomplete from '$lib/autocomplete/Autocomplete.svelte'

	const options = faker.helpers.multiple(() => faker.location.city(), {count: 25})
</script>

<div class="flow">
	<div>
		<h1>Input</h1>

		<h2>Text</h2>

		<div class="flow">
			<input type="text" placeholder="Placeholder..." />
			<input type="text" value="Input value" />
		</div>
	</div>

	<div>
		<h1>Select</h1>

		<div class="select">
			<select>
				<option value="1">Option 1</option>
				<option value="2">Option 2</option>
			</select>
		</div>
	</div>

	<div>
		<h1>Autocomplete</h1>

		<h2>Towns</h2>
		<Autocomplete {options} placeholder="Pick a town from the list" clearable />

		<h2>Empty</h2>
		<Autocomplete options={[]} />
	</div>
</div>
