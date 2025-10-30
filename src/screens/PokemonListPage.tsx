import React, { useMemo, useState } from 'react';
import { tss } from '../tss';
import { useGetPokemons } from 'src/hooks/useGetPokemons';
import { Input, Spin } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

export const PokemonListPage = () => {
  const { classes } = useStyles();
  const { data, loading } = useGetPokemons();
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm.trim()) return data;
    return data.filter((pokemon) => pokemon.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);

  if (loading) {
    return (
      <div className={classes.loading}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.searchContainer}>
        <Input
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="large"
          allowClear
        />
      </div>
      {filteredData.length === 0 ? (
        <div className={classes.emptyContainer}>
          <span className={classes.empty}>
            {searchTerm ? 'No matching Pokémon found' : 'No Pokémon available'}
          </span>
        </div>
      ) : (
        <ul className={classes.list}>
          {filteredData.map((pokemon) => (
            <li key={pokemon.id} className={classes.listItem}>
              <div
                role="presentation"
                onClick={() =>
                  navigate(`/pokemon/${pokemon.id}`, {
                    state: { backgroundLocation: location },
                  })
                }
                className={classes.pokemonCard}
              >
                {pokemon.sprite && (
                  <img src={pokemon.sprite} alt={pokemon.name} className={classes.image} />
                )}
                <div className={classes.info}>
                  <div className={classes.nameContainer}>
                    <span className={classes.pokemonName}>{pokemon.name}</span>
                    <span className={classes.pokemonId}>#{pokemon.id}</span>
                  </div>
                  {pokemon.types && pokemon.types.length > 0 && (
                    <div className={classes.types}>
                      {pokemon.types.map((type) => (
                        <span key={type} className={classes.typeBadge}>
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    padding: '24px',
  },
  searchContainer: {
    marginBottom: '24px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  emptyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    textTransform: 'capitalize',
  },
  empty: {
    color: theme.color.text.primary,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  listItem: {
    cursor: 'pointer',
  },
  pokemonCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },
  },
  image: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pokemonName: {
    fontSize: '18px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: theme.color.text.primary,
  },
  pokemonId: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.68)',
  },
  types: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  typeBadge: {
    padding: '4px 8px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: theme.color.text.primary,
    fontSize: '12px',
    textTransform: 'capitalize',
  },
}));
