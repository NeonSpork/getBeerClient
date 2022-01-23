<script lang="ts">
	import { secretActive, secretCounter } from '$lib/store';
	import { slide } from 'svelte/transition';
	import { expoInOut } from 'svelte/easing';
	import BackButton from './BackButton.svelte';
	import CraggsLoungeNormal from './CraggsLoungeNormal.svelte';
	import CraggsLoungeSecret from './CraggsLoungeSecret.svelte';
	import BeerButton from './BeerButton.svelte';
	import VodkaButton from './VodkaButton.svelte';
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

	async function openValve() {
		let valveAction = 'openBeer';
		if ($secretActive) {
			valveAction = 'openVodka';
		}
		try {
			const res = await fetch(`http://192.168.0.111/api/${valveAction}`, {
				method: 'GET'
			});
			console.log(res);
		} catch (error) {
			createErrorMessage(error);
		}
	}

	async function closeValve() {
		let valveAction = 'closeBeer';
		if ($secretActive) {
			valveAction = 'closeVodka';
		}
		try {
			const res = await fetch(`http://192.168.0.111/api/${valveAction}`, {
				method: 'GET'
			});
			console.log(res);
		} catch (error) {
			createErrorMessage(error);
		}
	}

	function createErrorMessage(message: string) {
		const errorMessage = document.createElement('h1');
		errorMessage.style.position = 'absolute';
		errorMessage.style.color = 'magenta';
		errorMessage.style.top = '0';
		errorMessage.style.textAlign = 'center';
		errorMessage.style.width = '100%';
		errorMessage.style.fontFamily = 'monospace';
		errorMessage.innerHTML = message;
		document.getElementById('container').appendChild(errorMessage);
	}

	onMount(() => {
		const valveButton = document.getElementById('dispense-button');
		valveButton.addEventListener('mousedown', openValve);
		valveButton.addEventListener('touchstart', openValve);
		valveButton.addEventListener('mouseup', closeValve);
		valveButton.addEventListener('touchend', closeValve);
	});
</script>

<div id="container">
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
	<div id="dispense-button">
		{#if $secretActive}
			<div transition:slide={{ duration: 750, easing: expoInOut }}>
				<VodkaButton />
			</div>
		{:else}
			<div transition:slide={{ duration: 750, easing: expoInOut }}>
				<BeerButton />
			</div>
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
