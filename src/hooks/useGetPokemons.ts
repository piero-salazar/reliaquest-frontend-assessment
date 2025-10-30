import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export interface Pokemon {
  id: string;
  name: string;
  types?: string[];
  sprite?: string;
}

export interface PokemonDetail extends Pokemon {
  captureRate: number;
  height: number;
  weight: number;
  stats: PokemonStat[];
}

interface PokemonResponseType {
  type: {
    typenames: {
      name: string;
    }[];
  };
}

interface PokemonResponseSprite {
  sprites: string;
}

interface PokemonResponseStat {
  stat: { name: string };
  base_stat: number;
}
interface PokemonResponse {
  pokemontypes: PokemonResponseType[];
  pokemonsprites: PokemonResponseSprite[];
  pokemonstats: PokemonResponseStat[];
}

interface PokemonStat {
  name: string;
  value: number;
}

export const GET_POKEMONS = gql`
  query GetPokemons($search: String) {
    pokemon(
      limit: 151
      order_by: { id: asc }
      where: {
        pokemonspecy: {
          pokemonspeciesnames: { language: { name: { _eq: "en" } }, name: { _regex: $search } }
        }
      }
    ) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
    }
  }
`;

export const GET_POKEMON_DETAILS = gql`
  query GetPokemonDetails($id: Int!) {
    pokemon(where: { id: { _eq: $id } }) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
        capture_rate
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
      weight
      height
      pokemonstats {
        base_stat
        stat {
          name
        }
      }
    }
  }
`;

const getPokemonTypes = (p: PokemonResponse): string[] =>
  p.pokemontypes.map((pokeType: PokemonResponseType): string => pokeType.type.typenames?.[0].name);

const getPokemonImage = (p: PokemonResponse): string => p.pokemonsprites?.[0].sprites;

const getPokemonStats = (p: PokemonResponse): PokemonStat[] =>
  p.pokemonstats.map(
    (pokeStat: PokemonResponseStat): PokemonStat => ({
      name: pokeStat.stat.name,
      value: pokeStat.base_stat,
    }),
  );

// Search should be done client-side for the mid-level assessment. Uncomment for the senior assessment.
export const useGetPokemons = (/* search?: string */): {
  data: Pokemon[];
  loading: boolean;
  error: useQuery.Result['error'];
} => {
  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMONS, {
    variables: {
      search: '', // `.*${search}.*`,
    },
  });

  return {
    data:
      data?.pokemon?.map(
        (p): Pokemon => ({
          id: p.id,
          name: p.pokemonspecy.pokemonspeciesnames?.[0]?.name,
          types: getPokemonTypes(p),
          sprite: getPokemonImage(p),
        }),
      ) ?? [],
    loading,
    error,
  };
};

export const useGetPokemonDetails = (
  id: number,
): {
  data: PokemonDetail | null;
  loading: boolean;
  error: useQuery.Result['error'];
} => {
  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMON_DETAILS, {
    variables: {
      id,
    },
  });

  if (loading) {
    return { data: null, loading, error };
  }

  const pokemon = data?.pokemon[0];

  const pokemonDetail = {
    id: pokemon?.id,
    name: pokemon.pokemonspecy.pokemonspeciesnames?.[0]?.name,
    types: getPokemonTypes(pokemon),
    sprite: getPokemonImage(pokemon),
    captureRate: pokemon.pokemonspecy?.capture_rate,
    height: pokemon.height,
    weight: pokemon.weight,
    stats: getPokemonStats(pokemon),
  };

  return {
    data: pokemonDetail,
    loading,
    error,
  };
};
