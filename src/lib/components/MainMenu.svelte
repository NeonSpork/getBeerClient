<script lang="ts">
	import { secretActive, secretCounter } from '$lib/store';
	import { slide } from 'svelte/transition';
	import { expoInOut } from 'svelte/easing';
	import BackButton from './BackButton.svelte';
	import CraggsLoungeNormal from './CraggsLoungeNormal.svelte';
	import CraggsLoungeSecret from './CraggsLoungeSecret.svelte';
	import BeerDispenser from './BeerDispenser.svelte';
	import VodkaDispenser from './VodkaDispenser.svelte';
	import { onMount } from 'svelte';

	function incrementSecret() {
		$secretCounter++;
		if ($secretCounter >= 3) {
			$secretActive = true;
		}
	}

	function resetDefault() {
		$secretActive = false;
		$secretCounter = -1;
	}

	function openValve() {
		console.log('opened!');
	}

	function closeValve() {
		console.log('closed!');
	}

	onMount(() => {
		const valveButton = document.getElementById('dispense-button');
		valveButton.addEventListener('mousedown', openValve);
		valveButton.addEventListener('touchstart', openValve);
		valveButton.addEventListener('mouseup', closeValve);
		valveButton.addEventListener('touchend', closeValve);
	});
</script>

<div>
	{#if $secretActive}
		<div
			class="back-button"
			on:click={resetDefault}
			transition:slide={{ duration: 650, easing: expoInOut }}
		>
			<BackButton />
		</div>
		<div class="horizontal" transition:slide={{ duration: 650, easing: expoInOut }}>
			<CraggsLoungeSecret />
		</div>
	{:else}
		<div
			class="horizontal"
			transition:slide={{ duration: 650, easing: expoInOut }}
			on:click={incrementSecret}
		>
			<CraggsLoungeNormal />
		</div>
	{/if}
	<div id="dispense-button" transition:slide={{ duration: 750, easing: expoInOut }}>
		{#if $secretActive}
			<VodkaDispenser />
		{:else}
			<BeerDispenser />
		{/if}
	</div>
</div>

<style>
	.back-button {
		position: absolute;
	}

	#dispense-button {
		position: absolute;
		bottom: 0;
		right: 0;
	}

	.horizontal {
		display: flex;
	}
</style>
