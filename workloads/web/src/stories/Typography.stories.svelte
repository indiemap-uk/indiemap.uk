<script module>
import '$lib/css/index.css'
import {defineMeta} from '@storybook/addon-svelte-csf'

const {Story} = defineMeta({
  title: 'Typography',
})
</script>

<Story name="Typography">
  <div class="prose">
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
  </div>

  <div class="prose flow">
    <p>
      <a href="./#">This is a link you can click</a>.
      <a href="./#" class="passive">A .passive link that has no decoration or feedback</a>
    </p>
    <p class="color-0">
      p.color-0: The result of the various, quite unknown, or dimly seen laws of variation is infinitely complex and
      diversified. It is well worth while carefully to study the several treatises published on some of our old
      cultivated plants, as on the hyacinth, potato, even the dahlia, etc.
    </p>
    <p class="color-1">
      p.color-1: When we look to the hereditary varieties or races of our domestic animals and plants, and compare them
      with species closely allied together, we generally perceive in each domestic race, as already remarked, less
      uniformity of character than in true species.
    </p>
    <p class="color-2">
      p.color-2: Having alluded to the subject of reversion, I may here refer to a statement often made by
      naturalists—namely, that our domestic varieties, when run wild, gradually but certainly revert in character to
      their aboriginal stocks.
    </p>
  </div>
</Story>

<style>
.prose {
	max-width: 85ch;
}
</style>
