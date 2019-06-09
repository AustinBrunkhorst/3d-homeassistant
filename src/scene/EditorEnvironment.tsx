import React, { useRef, useState } from 'react';
import { useRender, useResource } from 'react-three-fiber';
import * as THREE from 'three';

import { useAnimationFrame } from 'core/hooks/AnimationFrame';
import Skybox from './Skybox';

const Lights = ({ sunPosition }) => (
  <>
    <ambientLight color="white" intensity={0.5} />
    {/* <PointLight
      color="red"
      position={[0, 2, 0]}
      distance={5}
      intensity={1}
      
      
    /> */}
    <directionalLight position={sunPosition.current.clone()} />
  </>
);

export default function EditorEnvironment() {
  const [sunProps, setSunProps] = useState({
    distance: 400000,
    turbidity: 5,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1.15,
    elevation: 1,
    azimuth: 1
  });

  const sunPosition = useRef(new THREE.Vector3());

  useAnimationFrame(() => {
    const normalized = THREE.Math.mapLinear(
      (Math.cos(Date.now() / 50000) + 1) * 0.5,
      0,
      1,
      0.15,
      0.35
    );

    setSunProps({
      ...sunProps,
      azimuth: normalized,
      elevation: normalized
    });
  });

  return (
    <>
      <Lights sunPosition={sunPosition} />

      <Skybox
        {...sunProps}
        updateSunPosition={value => (sunPosition.current = value)}
      />
    </>
  );
}
