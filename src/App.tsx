import { CircularProgress } from "@material-ui/core";
import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AreaIndexPage from "pages/area";
import AreaEditPage from "pages/area/edit";
import AreaCardViewPage from "pages/area/view";
import * as hass from "store/actions/hass.actions";
import { selectLoggedIn } from "store/selectors/hass.selector";

function App() {
  const dispatch = useDispatch();
  const loggedIn = useSelector(selectLoggedIn, shallowEqual);

  if (!loggedIn) {
    dispatch(hass.loginAsync.request());

    return (
      <CircularProgress />
    );
  }
  
  return (
    <Router>
      <Route path="/" exact component={AreaIndexPage} />
      <Route path="/area/:id" exact component={AreaCardViewPage} />
      <Route path="/area/:id/edit" component={AreaEditPage} />
    </Router>
  );
}

export default App;
