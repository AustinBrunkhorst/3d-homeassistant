import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import React, { useEffect, useState } from "react";

function ModelAsset({ asset: { asset }, position }) {
  const [model, setModel] = useState<THREE.Object3D>();

  useEffect(() => {
    // Instantiate a loader
    const loader = new GLTFLoader();

    // Load a glTF resource
    loader.load(
      // resource URL
      asset.model,
      // called when the resource is loaded
      function (gltf) {

        //scene.add(gltf.scene);

        // gltf.animations; // Array<THREE.AnimationClip>
        // gltf.scene; // THREE.Scene
        // gltf.scenes; // Array<THREE.Scene>
        // gltf.cameras; // Array<THREE.Camera>
        // gltf.asset; // Object
        setModel(gltf.scene.children[0]);

      },
      // called while loading is progressing
      function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

      },
      // called when loading has errors
      function (error) {

        console.log('An error happened', error);

      }
    );
  }, [asset]);

  return model ? <primitive object={model} position={position} scale={new THREE.Vector3(3, 3, 3)} /> : <mesh position={position} castShadow receiveShadow>
    <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
    <meshStandardMaterial
      attach="material"
      color="red"
      emissive="red"
      emissiveIntensity={10}
    />
  </mesh>;
}

export default function ZoneObjects({ objects }) {
  return <>
    {objects.map(({ asset, id, position }) =>
      <ModelAsset key={id} asset={asset} position={position} />
    )}
  </>;
}