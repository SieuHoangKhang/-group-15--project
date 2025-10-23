import { render, screen } from '@testing-library/react';
import App from './App';

// Mock axios to avoid ESM parsing issues in Jest and to prevent real HTTP calls
jest.mock('axios', () => {
  const instance = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  };
  return { __esModule: true, default: { create: () => instance, ...instance } };
});

test('renders app title', () => {
  render(<App />);
  // Expect the Vietnamese header to be present
  const title = screen.getByText(/Quản lý User/i);
  expect(title).toBeInTheDocument();
});
