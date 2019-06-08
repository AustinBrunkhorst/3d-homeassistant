import React, { useRef, useState } from 'react';
import { useRender } from 'react-three-fiber';
import * as THREE from 'three';

import Skybox from './Skybox';

function PointLight({ ...props }) {
  const light = useRef<THREE.PointLight>();
  const helper = useRef<THREE.PointLightHelper>();

  return (
    <>
      <pointLight
        ref={light}
        {...props}
        onUpdate={() => {
          if (helper.current) {
            helper.current.update();
          }
        }}
      />
      {light.current && (
        <pointLightHelper
          args={[light.current, 0.25]}
          color={light.current.color}
        />
      )}
    </>
  );
}

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

export default function EditorEnvironment({ plane }) {
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

  useRender(() => {
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

      <mesh
        ref={plane}
        rotation={[-THREE.Math.degToRad(90), 0, THREE.Math.degToRad(90)]}
      >
        <planeGeometry attach="geometry" args={[10, 10]} />
        <meshLambertMaterial
          attach="material"
          color="#6cdcd1"
          side={THREE.DoubleSide}
        />
      </mesh>

      <Skybox
        {...sunProps}
        updateSunPosition={value => (sunPosition.current = value)}
      />
    </>
  );
}
