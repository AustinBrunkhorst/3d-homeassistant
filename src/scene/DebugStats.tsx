import { Box } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { WebGLRenderer } from 'three';
import useInterval from 'use-interval';

const Container = styled(Box).attrs({
  display: "flex",
  justifyContent: "center"
})`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 2px 16px;
`;

const StatContainer = styled(Box).attrs({
  mx: 2
})`
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.4), 0 -1px 1px rgba(0, 0, 0, 0.4),
    -1px 0 1px rgba(0, 0, 0, 0.4), 1px 0 1px rgba(0, 0, 0, 0.4);
`;

const StatName = styled(Box)`
  text-transform: uppercase;
  font-weight: bolder;
  font-size: 0.7em;
`;

const StatValue = styled(Box)``;

function Stat({ name, value }) {
  return (
    <StatContainer>
      <StatName>{name}</StatName> <StatValue>{value}</StatValue>
    </StatContainer>
  );
}

function WebGLStats({ fps, info }) {
  const {
    programs,
    memory: { geometries, textures },
    render: { calls, lines, points, triangles }
  } = info;

  return (
    <>
      <Stat name="fps" value={fps} />
      <Stat name="geometry" value={geometries} />
      <Stat name="textures" value={textures} />
      <Stat name="shaders" value={programs.length} />
      <Stat name="draw calls" value={calls} />
      <Stat name="lines" value={lines} />
      <Stat name="points" value={points} />
      <Stat name="triangles" value={triangles} />
    </>
  );
}

export interface ThreeDebuggerProps {
  gl: WebGLRenderer;
}

export default function ThreeDebugger({ gl }: ThreeDebuggerProps) {
  const [fps, setFps] = useState(0);
  const lastFrames = useRef(gl.info.render.frame);

  useInterval(() => {
    const { frame } = gl.info.render;

    const framesElapsed = frame - lastFrames.current;

    lastFrames.current = frame;

    setFps(framesElapsed);
  }, 1000);

  return (
    <Container>
      <WebGLStats fps={fps} info={gl.info} />
    </Container>
  );
}
