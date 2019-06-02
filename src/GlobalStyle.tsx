import React from "react";
import { createGlobalStyle } from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";

const GlobalStyles = createGlobalStyle`
  body, html, #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow: hidden;
  }
`;

function GlobalStyle() {
  return (
    <>
      <GlobalStyles />
      <CssBaseline />
    </>
  );
}

export default GlobalStyle;
