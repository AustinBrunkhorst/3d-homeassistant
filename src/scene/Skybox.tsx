import React from "react";
import { extend, useUpdate } from "react-three-fiber";
import Sky from "three-sky";

extend({ Sky });

export default function Skybox({
  distance,
  turbidity,
  rayleigh,
  mieCoefficient,
  mieDirectionalG,
  luminance,
  elevation,
  azimuth,
  updateSunPosition
}) {
  const ref = useUpdate(
    ({ material: { uniforms } }) => {
      uniforms.turbidity.value = turbidity;
      uniforms.rayleigh.value = rayleigh;
      uniforms.luminance.value = luminance;
      uniforms.mieCoefficient.value = mieCoefficient;
      uniforms.mieDirectionalG.value = mieDirectionalG;

      const theta = Math.PI * (elevation - 0.5);
      const phi = 2 * Math.PI * (azimuth - 0.5);

      uniforms.sunPosition.value.set(
        distance * Math.cos(phi),
        distance * Math.sin(phi) * Math.sin(theta),
        distance * Math.sin(phi) * Math.cos(theta)
      );

      if (updateSunPosition) {
        updateSunPosition(uniforms.sunPosition.value);
      }
    },
    [
      distance,
      turbidity,
      rayleigh,
      mieCoefficient,
      mieDirectionalG,
      luminance,
      elevation,
      azimuth
    ]
  );

  return <sky ref={ref} scale={[450000, 450000, 450000]} />;
}
