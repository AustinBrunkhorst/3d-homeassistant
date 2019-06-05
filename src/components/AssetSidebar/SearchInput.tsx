import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

import { SearchInputContainer } from "./elements";

const useStyles = makeStyles(
  createStyles({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: 350
    },
    input: {
      marginLeft: 8,
      flex: 1
    },
    iconButton: {
      padding: 10
    },
    divider: {
      width: 1,
      height: 28,
      margin: 4
    }
  })
);

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchInput({ value, onChange }: SearchInputProps) {
  const classes = useStyles();

  return (
    <SearchInputContainer>
      <IconButton
        className={classes.iconButton}
        aria-label="Search"
        onClick={() => onChange("")}
      >
        {value === "" ? <SearchIcon /> : <ClearIcon />}
      </IconButton>
      <InputBase
        className={classes.input}
        value={value}
        placeholder="Search assets"
        onChange={e => onChange(e.target.value)}
      />
    </SearchInputContainer>
  );
}

export default SearchInput;
