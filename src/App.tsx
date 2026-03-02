import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";

const App = () => {
  return (
    <Routes>
      <React.Fragment>
        
        <Route element={<MainPage />} path="/" />
        <Route element={<AdminPage />} path="admin" />
        <Route element={<NotFoundPage />} path="*" />
      </React.Fragment>
    </Routes>
  );
};

export default App;
