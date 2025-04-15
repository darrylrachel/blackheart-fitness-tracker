import { RouterProvider } from 'react-router-dom'
import router from './router';

function App() {
  if (!router) return <div>🚨 Router failed to load</div>;
  return (
    <RouterProvider router={router} fallbackElement={<div>Loading app...</div>} />
  );
  

}

export default App;
