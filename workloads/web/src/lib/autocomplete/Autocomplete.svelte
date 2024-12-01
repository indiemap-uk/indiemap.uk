<script lang="ts">
	import Svelecte, {config} from 'svelecte'
	/** The option render function, see https://svelecte-v5.vercel.app/rendering */
	type RenderFunction = (item: object, selectionSection?: boolean, inputValue?: string) => string

	interface AutocompleteProps {
		noResultMessage?: string
		clearable?: boolean
		/**
		 * The remote API URL, if any. Must contain `[query]` placeholder.
		 * Example: `https://api.example.com/search?q=[query]`
		 **/
		url?: string
		/**
		 * The minimum number of characters to trigger a query.
		 **/
		minQuery?: number
		/**
		 * The name of the input field.
		 **/
		name?: string
		/** The value field in the response array, e.g. `id` */
		valueField?: string
		/** The label field in the response array, e.g. `name` */
		labelField?: string
		/**
		 * The options to display in the dropdown.
		 **/
		options?: any[]
		/** See https://svelecte-v5.vercel.app/rendering */
		renderer?: RenderFunction
		/**
		 * The value of the input field.
		 **/
		value?: any[] | string | number | object | null
		placeholder?: string
		style?: string
	}

	let {
		clearable,
		labelField = 'name',
		minQuery = 3,
		name,
		options,
		noResultMessage = 'No results',
		placeholder,
		renderer,
		style,
		url,
		value = $bindable(),
		valueField = 'id',
	}: AutocompleteProps = $props()

	config.i18n.fetchQuery = () => 'Type to search'
	config.i18n.fetchEmpty = noResultMessage
</script>

<div {style}>
	<Svelecte
		{clearable}
		{labelField}
		{minQuery}
		{name}
		{options}
		{placeholder}
		{renderer}
		{valueField}
		bind:value
		fetch={url}
	/>
</div>

<style>
	:global(.svelecte) {
		height: var(--input-height);
		width: var(--width, 100%);
		min-width: var(--min-width, var(--size-fluid-8));
	}
	/* Push the chevron left a bit */
	:global(.svelecte .sv-control) {
		padding-inline-start: 1rem;
		padding-inline-end: 5px;
	}

	/* this prevents the widget from getting taller on focus */
	:global(.sv-input--sizer.sv-input--sizer) {
		position: absolute !important;
	}

	:root {
		/* See https://svelecte-v5.vercel.app/theme for defaults */
		--sv-min-height: var(--input-height);
		--sv-bg: var(--input-bg);
		/* TODO: a form disabled input bg */
		--sv-disabled-bg: #eee;
		--sv-border: var(--input-border-width) var(--input-border-style) var(--input-border-color);
		--sv-border-radius: var(--input-border-radius);
		/* TODO: general padding for inputs */
		--sv-general-padding: 0px;
		--sv-control-bg: var(--sv-bg);
		/* the padding for an item in the scoll list */
		--sv-item-wrap-padding: 8px 1rem;
		--sv-selection-wrap-padding: 0;
		--sv-selection-multi-wrap-padding: 3px 3px 3px 6px;

		/* set it to var(--input-color); to show the icon */
		--sv-icon-color: transparent;
		/* set it to var(--input-color); to show the icon */
		--sv-icon-color-hover: transparent;
		/* 23 is roughly similar to the select chevron */
		--sv-icon-size: 23px;
		/* the | between the clear button and chevron */
		--sv-separator-bg: transparent;

		--sv-placeholder-color: var(--placeholder-color);
		--sv-dropdown-bg: var(--sv-bg);
		--sv-dropdown-border: var(--sv-border);
		--sv-dropdown-offset: 2px;
		--sv-dropdown-width: auto;
		--sv-dropdown-shadow: var(--shadow-3);
		--sv-dropdown-height: 320px;
		/* The bg of the selected item in the dropdown */
		--sv-dropdown-active-bg: var(--secondary-color-bg-hover);
		--sv-loader-border: 2px solid var(--primary-color-ink);
	}
</style>
