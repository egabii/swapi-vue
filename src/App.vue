<script setup lang='ts'>
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

watch(currentPage, async (newpage) => {
  prevButtonDisable.value = newpage === 1;
  planets.value = await fetchPlanets(newpage);
  isLoading.value = false;
}, { immediate: true });

watch(inputSearch, () => {

}, { immediate: true });

const onNextPage = () => {
  isLoading.value = true;
  currentPage.value = Math.ceil(planets.value.total / planets.value.pageSize);;
};

const onPrevPage = () => {
  isLoading.value = true;
  currentPage.value = 1;
};

const pagesClickables = () => Array.from({ length: Math.ceil(planets.value.total / planets.value.pageSize) }, (_, i) => i + 1);

const onClickPage = (pageNumber: number) => {
  currentPage.value = pageNumber;

}

const searchPlanetName = async() => {
  if (inputSearch.value === '') {
    planets.value = await fetchPlanets(1, inputSearch.value);
    currentPage.value = 1;
  }
};

const resetSearch = async () => {
  isLoading.value = true;
  inputSearch.value = '';
  planets.value = await fetchPlanets();
  isLoading.value = false;
}
</script>

<template>

<section class='container'>
  <header class='header'>HEADER</header>
  <main class='content'>
    <span v-if='isInitialLoading'>Loading...</span>
    <section v-else='isInitialLoading' class='planets-container'>
      <form @submit.prevent='searchPlanetName'>
        <input v-model='inputSearch'  placeholder='type the name of a planet' />
        <button type='submit'> Search </button>
        <button @click='resetSearch' :disabled="inputSearch === ''"> Reset </button>
      </form>
      <span v-if='isLoading'>Loading...</span>
      <ul v-else-if='planets.results.length > 0'>
        <li v-for='planet in planets?.results' :key='planet'>
          {{ planet }}
        </li>
      </ul>
      <section v-else>
        No planets were found
      </section>
      <section class='pagination-buttons'>
        <button :disabled='prevButtonDisable' @click='onPrevPage'>First</button>
        <div class='pages-box'>
          <a v-for='pageNumber in pagesClickables()' :key='pageNumber' @click='$event => onClickPage(pageNumber)'>{{ pageNumber }}</a>
        </div>
        <button @click='onNextPage'>Last</button>
      </section>
    </section>
  </main>
  <footer class='footer'>
    Swapi+Vue
  </footer>
</section>
</template>
