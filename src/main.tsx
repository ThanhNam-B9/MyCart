import ReactDOM from 'react-dom/client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from 'src/App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from './contexts/appContext'
import ErrorBoundary from './components/ErrorBoundary'
import 'src/i18n/i18n'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AppProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    {/* </React.StrictMode> */}
  </BrowserRouter>
)
