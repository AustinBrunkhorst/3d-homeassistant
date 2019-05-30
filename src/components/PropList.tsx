import React from "react";
import styled from "styled-components";
import { List } from "@material-ui/core";
import { connect } from "react-redux";

import PropListItem from "./PropListItem";

function mapDispatchToProps(dispatch) {
  return {};
}

function mapStateToProps(state) {
  return { ...state };
}

const Container = styled(List)`
  width: 100%;
  overflow: auto;
`;

function PropList({ props }) {
  return (
    <Container>
      {props.map(prop => (
        <PropListItem key={prop.title} prop={prop} />
      ))}
    </Container>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropList);
