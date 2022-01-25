<script lang="ts">
	import '$lib/style/app.scss';
</script>

<div class="container">
	<main>
		<slot />
	</main>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
	}
</style>
