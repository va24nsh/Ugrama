import React, { createContext, useState } from 'react'
import Login from './Components/Login'
import Dashboard from './Components/Dashboard/StudentDashboard/Dashboard';
import { BrowserRouter } from 'react-router-dom';

const MyContext = createContext({
  isSidebarOpen: true,
  setIsSidebarOpen: () => {}
});

// Export the context so other components can import it
export { MyContext };

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const values = {
    isSidebarOpen,
    setIsSidebarOpen
  };

  return (
    <div>
      <MyContext.Provider value={values}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/previewai" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </MyContext.Provider>
    </div>
  )
}

export default App