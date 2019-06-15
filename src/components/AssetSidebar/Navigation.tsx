import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import EntitiesIcon from '@material-ui/icons/DeviceHub';
import AssetIcon from '@material-ui/icons/Widgets';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    maxWidth: 350
  }
});

export default function Navigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setValue(newValue);
  }

  return (
    <Paper square className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab component={Link} icon={<AssetIcon />} label="Assets" to="/test" />
        <Tab component={Link} icon={<EntitiesIcon />} label="Entities" to="/" />
      </Tabs>
    </Paper>
  );
}
