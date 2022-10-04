<script lang="ts">
	import gpio from './GpioController.svelte';
	import { secretActive, secretCounter } from '$lib/store';
	import { fly } from 'svelte/transition';
	import { expoInOut } from 'svelte/easing';
	import BackButton from './BackButton.svelte';
	import CraggsLoungeNormal from './CraggsLoungeNormal.svelte';
	import CraggsLoungeSecret from './CraggsLoungeSecret.svelte';
	import BeerButton from './BeerButton.svelte';
	import VodkaButton from './VodkaButton.svelte';
	import { onMount } from 'svelte';

	const endpoint = `http://192.168.0.111/api/`;
	$: temp = 'Temp uninitialized';
	$: pints = 'Pints uninitialized';

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
		console.log('opening');
		let valveAction = 'openBeer';
		if ($secretActive) {
			valveAction = 'openVodka';
		}
		// TODO Add GPIO interaction here instead of fetch request
		try {
			const res = await fetch(`${endpoint}${valveAction}`, {
				method: 'GET'
			});
		} catch (error) {
			createErrorMessage(error);
		}
	}

	async function closeValve() {
		console.log('closing');
		let valveAction = 'closeBeer';
		if ($secretActive) {
			valveAction = 'closeVodka';
		}
		// TODO Add GPIO interaction here instead of fetch request
		// try {
		// 	const res = await fetch(`${endpoint}${valveAction}`, {
		// 		method: 'GET'
		// 	});
		// 	getPintsData();
		// } catch (error) {
		// 	createErrorMessage(error);
		// }
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

	async function getTempData() {
		setTimeout(async () => {
			try {
				// TODO direct GPIO interaction here with temp sensor?
				const tempFetch = await fetch(`${endpoint}temp`, {
					method: 'GET'
				});
				temp = `${Math.round(parseFloat(tempFetch.toString()))} \u00B0`;
			} catch {
				temp = 'Temp sensor error';
			}
		}, 10000);
	}

	async function getPintsData() {
		try {
			// TODO direct GPIO interaction here with weight sensor?
			const pintsFetch = await fetch(`${endpoint}pints`, {
				method: 'GET'
			});
			pints = pintsFetch.toString();
		} catch {
			pints = 'Weight sensor error';
		}
	}

	onMount(() => {
		try {
			let gpio4 = gpio.export(4, {
				direction: gpio.DIRECTION.OUT,
				interval: 200,
				ready: function () {
					// logic here?
				}
			});
		} catch {
			console.log('gpio stuff went horribly wrong');
		}
		window.addEventListener('contextmenu', (e) => e.preventDefault());
		getTempData();
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
			transition:fly={{ duration: 500, easing: expoInOut, x: -250, y: 0 }}
		>
			<BackButton />
		</div>
		<div class="horizontal" transition:fly={{ duration: 500, easing: expoInOut, x: 1250, y: -600 }}>
			<CraggsLoungeSecret />
		</div>
	{:else}
		<div
			class="horizontal"
			transition:fly={{ duration: 500, easing: expoInOut, x: 1250, y: -600 }}
			on:click={incrementSecret}
		>
			<CraggsLoungeNormal />
		</div>
	{/if}
	{#if $secretActive}
		<div id="dispense-button">
			<div transition:fly={{ duration: 500, easing: expoInOut, x: 1000, y: 0 }}>
				<VodkaButton />
			</div>
		</div>
	{:else}
		<div id="dispense-button">
			<div transition:fly={{ duration: 500, easing: expoInOut, x: 1000, y: 0 }}>
				<BeerButton />
			</div>
		</div>
	{/if}
</div>

{#if $secretActive}
	<div class="glow">
		<div class="red" transition:fly={{ duration: 500, easing: expoInOut, x: -1000, y: 0 }}>
			<h1>{temp}</h1>
			<h1>{pints}</h1>
		</div>
	</div>
{:else}
	<div class="glow">
		<div class="purple" transition:fly={{ duration: 500, easing: expoInOut, x: -1000, y: 0 }}>
			<h1>{temp}</h1>
			<h1>{pints}</h1>
		</div>
	</div>
{/if}

<style>
	.back-button {
		position: absolute;
	}

	.glow {
		position: absolute;
		display: flex;
		bottom: 10px;
		left: 25px;
		color: white;
	}

	.purple {
		text-shadow: 0px 0px 3px #6200ff, 0px 0px 5px #6200ff, 0px 0px 7px #6200ff, 0px 0px 10px #6200ff,
			0px 0px 15px #6200ff, 0px 0px 30px #6200ff, 0px 0px 60px #6200ff, 0px 0px 150px #6200ff;
	}

	.red {
		text-shadow: 0px 0px 3px #f00, 0px 0px 5px #f00, 0px 0px 7px #f00, 0px 0px 10px #f00,
			0px 0px 15px #f00, 0px 0px 30px #f00, 0px 0px 60px #f00, 0px 0px 150px #f00;
	}
	#dispense-button {
		position: absolute;
		bottom: 0;
		right: 0;
	}

	.horizontal {
		display: flex;
		justify-content: center;
		align-items: center;
		max-width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
</style>
