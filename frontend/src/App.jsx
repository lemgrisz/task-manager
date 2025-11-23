import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import { Provider } from "react-redux";
import store from "./redux/store";
import AuthHandler from "./components/AuthHandler";
import PrivateRoute from "./components/PrivateRoute";


const App = () => {
  return (
    <Provider store={store}>
      <AuthHandler />
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
