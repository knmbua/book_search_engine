import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.js'
import SearchBooks from './pages/SearchBooks.js'
import SavedBooks from './pages/SavedBooks.js'
import { StoreProvider } from './store/index.js'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', 
  cache: new InMemoryCache()
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <SearchBooks />
      }, {
        path: '/saved',
        element: <SavedBooks />
      }
    ],
    
  }
], {
  future: {
    // Router optional flags to get rid of future update warnings
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StoreProvider>
      <ApolloProvider client={client}>
    <RouterProvider router={router} future={{
      // Router optional flag to get rid of future update warnings
      v7_startTransition: true
    }} />
      </ApolloProvider>
  </StoreProvider>
)
