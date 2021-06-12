import * as React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";

const App: React.FC = () => (
  <Router>
    <Route exact path="/">
      <LandingPage />
    </Route>
  </Router>
);

export default App;
