export interface ISwapiPlanet {
	name: string;
	population: string | number;
}

export type PlanetSchema = {
	pageSize: number;
	total: number;
	results: ISwapiPlanet[];
	currentPage: number;
};

export const PlanetSchemaDefaultValues: PlanetSchema = {
	pageSize: 1,
	total: 0,
	results: [],
	currentPage: 1,
};

const SUCCESS_STATUS = 200;

export default async function fetchPlanets(page = 1, search = ''): Promise<PlanetSchema> {
	try {
		const searchName = search !== '' ? `&search=${search}` : '';
		const response = await fetch(`https://swapi.dev/api/planets?page=${page}${searchName}`);
		if (response.ok && response.status === SUCCESS_STATUS) {
			const json = await response.json();
			return {
				pageSize: json.results.length,
				total: json.count,
				results: json.results.map((result: ISwapiPlanet) => ({
					name: result.name,
					population: result.population === 'unknown' ? Infinity : +result.population, // returns infinity when the population is unknown
				})),
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
