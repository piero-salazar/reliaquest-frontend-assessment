import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { PokemonListPage } from './screens/PokemonListPage';
import { LayoutWrapper } from './LayoutWrapper';
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { HomePage } from './screens/HomePage';
import { PokemonDetailModal } from './screens/PokemonDetailModal';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graphql.pokeapi.co/v1beta2',
  }),
  cache: new InMemoryCache(),
});

const AppRoutes = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | undefined;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<LayoutWrapper />}>
          <Route index element={<HomePage />} />
          <Route path="/list" element={<PokemonListPage />} />
        </Route>
      </Routes>

      <Routes>
        <Route path="/pokemon/:id" element={<PokemonDetailModal />} />
        <Route path="*" element={null} />
      </Routes>
    </>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </ApolloProvider>
);

export default App;
