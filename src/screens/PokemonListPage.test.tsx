import React from 'react';
import { act, render } from 'src/test-utils';
import { PokemonListPage } from './PokemonListPage';
import { MemoryRouter, useNavigate } from 'react-router-dom';

jest.mock('src/hooks/useGetPokemons', () => ({
  useGetPokemons: jest.fn().mockReturnValue({ data: [{ id: '1', name: 'Bulbasaur' }] }),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('PokemonListPage', () => {
  test('it renders', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );
    getByText('Bulbasaur');
  });
  test('clicking on a pokemon calls navigate', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    const { getByText, user } = render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    await act(async () => {
      await user.click(getByText('Bulbasaur'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/pokemon/1', expect.any(Object));
  });
  test('typing in the search bar filters the results', async () => {
    // Mock with two pokemons for filtering logic
    const bulbasaur = { id: '1', name: 'Bulbasaur' };
    const charmander = { id: '4', name: 'Charmander' };
    const { useGetPokemons } = require('src/hooks/useGetPokemons');
    (useGetPokemons as jest.Mock).mockReturnValue({ data: [bulbasaur, charmander] });

    const { getByPlaceholderText, queryByText, user } = render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    // Both pokemons should appear at first
    expect(queryByText('Bulbasaur')).toBeInTheDocument();
    expect(queryByText('Charmander')).toBeInTheDocument();

    // Type 'Bulb' in the search bar
    const input = getByPlaceholderText('Search Pokémon...');
    await act(async () => {
      await user.type(input, 'Bulb');
    });

    // Only Bulbasaur should appear
    expect(queryByText('Bulbasaur')).toBeInTheDocument();
    expect(queryByText('Charmander')).not.toBeInTheDocument();

    // Clear the input
    await act(async () => {
      await user.clear(input);
    });

    // Both pokemons should appear again
    expect(queryByText('Bulbasaur')).toBeInTheDocument();
    expect(queryByText('Charmander')).toBeInTheDocument();
  });
});
