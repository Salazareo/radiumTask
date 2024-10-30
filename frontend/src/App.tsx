import '@mantine/core/styles.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { mainStore } from './state/jotaiStores';
import { queryClient } from './state/queryClients';
import { theme } from './theme';

export default function App() {
  return (
    <Provider store={mainStore}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <Router />
        </MantineProvider>
      </QueryClientProvider>
    </Provider>
  );
}
