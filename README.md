# SWAPI.VUE

This project is a Vue 3 single page application, which retrieves data from [SWAPI API](https://swapi.dev/documentation) and user can search a planet, find planet usign pagination and read a detailed view of a planet.

## Setup

- [Vite](https://vitejs.dev/)
- [Vue 3](https://vuejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
- [Layoutit](https://grid.layoutit.com/) it lets you build a layout with cssgrid. it is useful if you have to build a layout quickly
- API: [SWAPI/planets](https://swapi.dev/api/planets)
- [excalidraw](https://excalidraw.com/) - it is a simple and useful tool when you need to draw some wireframes (it is not like figma at all) or the flow of your app.


## Technical Question

1. What's a closure?

   A closure happens when an inner function uses the outer variables and function in which scoped were defined

   1.1 Where in the code is there a closure?
   Callback functions we use in `watch` and `onMounted` are closures, because we use all the `ref()` state we declared outside of each callback.

The vue component itself is also a closure as far as I understand.

```javascript
onMounted(async () => {
	const nonSortingPlanets = await fetchPlanets();
	planets.value = {
		...nonSortingPlanets,
		results: _sortBy(nonSortingPlanets.results, [selectedSorting.value])
	};
	isInitialLoading.value = false;
});
```
```javascript
watch(
	currentPage,
	async (newpage) => {
		isLoading.value = true;
		prevButtonDisable.value = newpage === 1;
		const nonSortingPlanets = await fetchPlanets(newpage);
		planets.value = {
			...nonSortingPlanets,
			results: _sortBy(nonSortingPlanets.results, [selectedSorting.value])
		};
		isLoading.value = false;
	},
	{ immediate: true }
);
```
2. Which are the potential side-effects in any function? A function causes side-effect when it changes
the state outside of its scope. So I think that everything that force the component to mutate is what we call side effects. i.e API calls.

   2.1 Could you point out any of these cases in
your code? Are they expected? Can they be avoided?

The API call is side effect and the sort action as well. Regarding `watch` and `onMounted` are good for side-effects (at least is what I understand when I have read the documentation). Both side-effects are expected because when as soon as Vue mounts the component, we have to call planets resources in order to display those in the UI. Then when user wants to change the page, we have to call API with page params in  order to retrieve next batch of planets. The same situation is when user searches a planet by name, all the examples I have mentioned are expected.

Perhaps we can replace `watch` with `computed` when we select sorting option.
```javascript
watch(selectedSorting, (newSelectedSorting) => {
	planets.value.results = _sortBy(planets.value.results, [newSelectedSorting]);
});
```
## Vite + Vue 3

> I keep this section due it belongs to Vite + Vue 3 template and we might need it for future reference

### Vite template

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

### Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
