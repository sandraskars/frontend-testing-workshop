import * as React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { LandingPage } from "./pages/LandingPage";

const App: React.FC = () => (
  <Router>
    <Route exact path="/">
      <LandingPage />
    </Route>
    <Route exact path="/login">
      <LoginPage />
    </Route>
  </Router>
);

export default App;
