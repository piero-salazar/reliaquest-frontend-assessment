import React from 'react';
import { render } from './test-utils';
import App from './App';

jest.mock('../README.md', () => ({
  text: jest.fn().mockResolvedValue('hello world'),
}));

test('renders home page', async () => {
  const { findByTestId } = render(<App />);
  expect(await findByTestId('MockReactMarkdown')).toBeInTheDocument();
});
