import { Box } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import { CanvasContext } from 'react-three-fiber/types/src/canvas';
import styled from 'styled-components';
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
  context: React.MutableRefObject<CanvasContext | undefined>;
}

function ThreeDebugger({ context }: ThreeDebuggerProps) {
  const [fps, setFps] = useState(0);
  const lastFrames = useRef(context.current ? context.current.frames : 0);

  useInterval(() => {
    if (!context.current || !context.current.gl) {
      return;
    }

    const { frame } = context.current.gl.info.render;

    const framesElapsed = frame - lastFrames.current;

    lastFrames.current = frame;

    setFps(framesElapsed);
  }, 1000);

  if (!context.current || !context.current.gl) {
    return null;
  }

  return (
    <Container>
      <WebGLStats fps={fps} info={context.current.gl.info} />
    </Container>
  );
}

export default React.memo(ThreeDebugger);
