import { render, screen } from '@testing-library/react';
import App from './App';
import { UsersProvider } from './UsersContext';

// Mock axios to avoid ESM parsing issues in Jest and to prevent real HTTP calls
jest.mock('axios', () => {
  const instance = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  return { __esModule: true, default: { create: () => instance, ...instance } };
});

test('renders app title', () => {
  render(
    <UsersProvider>
      <App />
    </UsersProvider>
  );
  // Expect the Vietnamese header to be present
  const title = screen.getByText(/Quản lý User/i);
  expect(title).toBeInTheDocument();
});
