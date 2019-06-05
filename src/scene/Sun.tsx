import React from "react";
import { useUpdate } from "react-three-fiber";

export default function Sun({
  distance,
  turbidity,
  rayleigh,
  mieCoefficient,
  mieDirectionalG,
  luminance,
  elevation,
  azimuth
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

  return <sky ref={ref} scale={[1000, 1000, 1000]} />;
}
