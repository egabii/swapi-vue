export type PlanetSchema = {
	pageSize: number;
	total: number;
	results: string[];
	currentPage: number;
};

export const PlanetSchemaDefaultValues: PlanetSchema = {
	pageSize: 1,
	total: 0,
	results: [],
	currentPage: 1,
};

interface ISwapiPlanet {
	name: string
}

export default async function fetchPlanets(page = 1, search = ''): Promise<PlanetSchema> {
	try {
		const searchName = search !== '' ? `&search=${search}` : '';
		const response = await fetch(`https://swapi.dev/api/planets?page=${page}${searchName}`);
		if (response.ok && response.status === 200) {
			const json = await response.json();
			return {
				pageSize: json.results.length,
				total: json.count,
				results: json.results.map((result: ISwapiPlanet) => result.name),
				currentPage: page,
			};
		} else {
			throw new Error('could not resolve response');
		}
	} catch (error) {
		return PlanetSchemaDefaultValues;
		console.log('here comes the pain', error);
	}
}
