import { render, screen } from '@testing-library/react';
import App from './App';

test('renders pdf output button', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: /pdf出力/i });
  expect(button).toBeInTheDocument();
});

