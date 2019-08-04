import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ZoneEditorPage from 'pages/ZoneEditor';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  }
}));

function DenseAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            Zone Editor
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Box display="flex" flexDirection="column">
        <DenseAppBar />

        <Route path="/" exact component={ZoneEditorPage} />
        <Route path="/entities" component={EntitiesList} />
      </Box>
    </Router>
  );
}

function EntitiesList() {
  return <div>hi</div>;
}

export default App;
