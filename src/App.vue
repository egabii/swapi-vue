<script setup lang="ts">
import { ref, onMounted} from 'vue';
const items = ref(['foo', 'bar', 'delta', 'beta', 'gamma']);
const planets = ref([]);
async function fetchPlanets() {
  try {
    const response = await fetch('https://swapi.dev/api/planets')
    if (response.ok && response.status === 200) {
      const json = await response.json();
      planets.value = json.results;
    } else {
      throw new Error('could not resolve response');
    }
  } catch(error) {
    console.log('here comes the pain', error)
  }
};

onMounted(() => { fetchPlanets(); });
</script>

<template>
  <div class='container'>
    <span v-if="planets.length === 0">Loading...</span>
    <ul v-else>
      <li v-for="planet in planets" :key="planet?.name">
        {{ planet.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
