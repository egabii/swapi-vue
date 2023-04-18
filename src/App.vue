<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import fetchPlanets, { PlanetSchema, PlanetSchemaDefaultValues } from './features/planets';
import { sortBy as _sortBy } from 'lodash';

const planets = ref<PlanetSchema>(PlanetSchemaDefaultValues);
const currentPage = ref(1);
const isLoading = ref(true);
const isInitialLoading = ref(true);
const prevButtonDisable = ref(true);
const inputSearch = ref('');
const sortingSelect = ref(['name', 'population']);
const selectedSorting = ref('name');

onMounted(async () => {
	const nonSortingPlanets = await fetchPlanets();
	planets.value.results = _sortBy(nonSortingPlanets.results, [selectedSorting.value]);
	isInitialLoading.value = false;
});

watch(
	currentPage,
	async (newpage) => {
		isLoading.value = true;
		prevButtonDisable.value = newpage === 1;
		planets.value = await fetchPlanets(newpage);
		isLoading.value = false;
	},
	{ immediate: true }
);

watch(selectedSorting, (newSelectedSorting) => {
	planets.value.results = _sortBy(planets.value.results, [newSelectedSorting]);
});

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
		isLoading.value = true;
		planets.value = await fetchPlanets(1, inputSearch.value);
		currentPage.value = 1;
		isLoading.value = false;
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
				<p>This vue app only fetches planets resources from SWAPI</p>
				<section class="toolbar">
					<section class="filter-bar">
						<select v-model="selectedSorting">
							<option v-for="option in sortingSelect" :key="option" :value="option">{{ `${option}(asc)` }}</option>
						</select>
					</section>
					<form class="form-container" @submit.prevent="searchPlanetName">
						<input v-model="inputSearch" placeholder="type the name of a planet" />
						<button class="btn-primary" type="submit">Search</button>
						<button v-if="inputSearch !== ''" class="btn-secondary" @click="resetSearch">Reset</button>
					</form>
				</section>
				<span v-if="isLoading">Loading...</span>
				<div class="card-container" v-else-if="planets.results.length > 0">
					<div class="card" v-for="planet in planets?.results" :key="planet?.name">
						{{ `${planet?.name} / ${planet?.population === Infinity ? 'unknown' : planet?.population}` }}
					</div>
				</div>
				<section v-else>No planets were found</section>
				<section class="pagination">
					<button class="pagination-button btn-primary" :disabled="prevButtonDisable" @click="onPrevPage">First</button>
					<div class="page-numbers">
						<a class="number" :class="{ active: currentPage === pageNumber }" v-for="pageNumber in pagesClickables()" :key="pageNumber" @click="() => onClickPage(pageNumber)">{{
							pageNumber
						}}</a>
					</div>
					<button class="pagination-button btn-primary" @click="onNextPage">Last</button>
				</section>
			</section>
		</main>
		<footer class="footer">Swapi+Vue3</footer>
	</section>
</template>
