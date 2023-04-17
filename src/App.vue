<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import fetchPlanets, { PlanetSchema, PlanetSchemaDefaultValues } from './features/planets';

const planets = ref<PlanetSchema>(PlanetSchemaDefaultValues);
const currentPage = ref(1);
const isLoading = ref(true);
const isInitialLoading = ref(true);
const prevButtonDisable = ref(true);
const inputSearch = ref('');

onMounted(async () => {
	planets.value = await fetchPlanets();
	isInitialLoading.value = false;
});

watch(
	currentPage,
	async (newpage) => {
		prevButtonDisable.value = newpage === 1;
		planets.value = await fetchPlanets(newpage);
		isLoading.value = false;
	},
	{ immediate: true }
);

const onNextPage = () => {
	isLoading.value = true;
	currentPage.value = Math.ceil(planets.value.total / planets.value.pageSize);
};

const onPrevPage = () => {
	isLoading.value = true;
	currentPage.value = 1;
};

const pagesClickables = () => Array.from({ length: Math.ceil(planets.value.total / planets.value.pageSize) }, (_, i) => i + 1);

const onClickPage = (pageNumber: number) => {
	currentPage.value = pageNumber;
};

const searchPlanetName = async () => {
	if (inputSearch.value !== '') {
		planets.value = await fetchPlanets(1, inputSearch.value);
		currentPage.value = 1;
	}
};

const resetSearch = async () => {
	isLoading.value = true;
	inputSearch.value = '';
	planets.value = await fetchPlanets();
	isLoading.value = false;
};
</script>

<template>
	<section class="container">
		<header class="header">
			<section class="header-content">
				<h1>SWAPI + VUE3</h1>
				<div class="github-section">
					<a href="https://github.com/egabii/swapi-vue" target="_blank">Github</a>
				</div>
			</section>
		</header>
		<main class="content">
			<span v-if="isInitialLoading">Loading...</span>
			<section v-else class="planets-container">
				<form @submit.prevent="searchPlanetName">
					<input v-model="inputSearch" placeholder="type the name of a planet" />
					<button type="submit">Search</button>
					<button @click="resetSearch" :disabled="inputSearch === ''">Reset</button>
				</form>
				<span v-if="isLoading">Loading...</span>
				<ul v-else-if="planets.results.length > 0">
					<li v-for="planet in planets?.results" :key="planet">
						{{ planet }}
					</li>
				</ul>
				<section v-else>No planets were found</section>
				<section class="pagination">
					<button class="pagination-button" :disabled="prevButtonDisable" @click="onPrevPage">First</button>
					<div class="page-numbers">
						<a v-for="pageNumber in pagesClickables()" :key="pageNumber" @click="() => onClickPage(pageNumber)">{{ pageNumber }}</a>
					</div>
					<button class="pagination-button" @click="onNextPage">Last</button>
				</section>
			</section>
		</main>
		<footer class="footer">Swapi+Vue</footer>
	</section>
</template>
