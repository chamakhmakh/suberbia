"use client";

import * as THREE from "three";
import {
  CameraControls,
  Environment,
  Preload,
  useTexture,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { useCustomizerControls } from "./context";
import { asImageSrc } from "@prismicio/client";
import { Skateboard } from "@/components/Skateboard";

const DEAFULT_WHEEL_TEXTURE = "/skateboard/SkateWheel1.png";
const DEAFULT_DECK_TEXTURE = "/skateboard/Deck.webp";
const DEAFULT_TRUCK_COLOR = "#6F6E6A";
const DEAFULT_BOLT_COLOR = "#6F6E6A";
const ENVIRONMENT_COLOR = "#3B3A3A";

type Props = {
  wheelTextureURLs: string[];
  deckTextureURLs: string[];
};

export default function Preview({ wheelTextureURLs, deckTextureURLs }: Props) {
  const cameraControls = useRef<CameraControls>(null);
  const floorRef = useRef<THREE.Mesh>(null);
  const { selectedWheel, selectedDeck, selectedBolt, selectedTruck } =
    useCustomizerControls();
  const wheelTesxtureURL =
    asImageSrc(selectedWheel?.texture) ?? DEAFULT_WHEEL_TEXTURE;
  const deckTesxtureURL =
    asImageSrc(selectedDeck?.texture) ?? DEAFULT_DECK_TEXTURE;
  const truckColor = selectedTruck?.color ?? DEAFULT_TRUCK_COLOR;
  const boltColor = selectedBolt?.color ?? DEAFULT_BOLT_COLOR;

  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(1.5, 0.8, 0)
    );
  }, [selectedDeck]);

  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(-0.12, 0.29, 0.57),
      new THREE.Vector3(0.1, 0.25, 0.9)
    );
  }, [selectedTruck]);

  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(-0.08, 0.54, 0.64),
      new THREE.Vector3(0.09, 1, 0.9)
    );
  }, [selectedWheel]);

  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(-0.25, 0.3, 0.62),
      new THREE.Vector3(-0.5, 0.35, 0.8)
    );
  }, [selectedBolt]);

  function setCameraControls(target: THREE.Vector3, pos: THREE.Vector3) {
    if (!cameraControls.current) return;

    cameraControls.current.setTarget(target.x, target.y, target.z, true); // this is the target of the camera
    cameraControls.current.setPosition(pos.x, pos.y, pos.z, true); // this is the position of the camera
  }

  function onCameraControlStart() {
    if (
      !cameraControls.current ||
      !floorRef.current ||
      cameraControls.current.colliderMeshes.length > 0
    )
      return; // if the camera controls is null, then we return

    cameraControls.current.colliderMeshes = [floorRef.current]; // if the camera controls is not null, then we set the collider meshes to the floor
  }

  return (
    <Canvas camera={{ position: [2.5, 1, 0], fov: 50 }} shadows>
      <Suspense fallback={null}>
        <Environment
          files={"/hdr/warehouse-512.hdr"}
          environmentIntensity={0.6}
        />
        <directionalLight
          castShadow
          lookAt={[0, 0, 0]}
          position={[1, 1, 1]}
          intensity={1.6}
        />
        <fog attach="fog" args={[ENVIRONMENT_COLOR, 3, 10]} />
        <color attach="background" args={[ENVIRONMENT_COLOR]} />
        <StageFloor />

        <mesh rotation={[-Math.PI / 2, 0, 0]} ref={floorRef}>
          <planeGeometry args={[6, 6]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        <Skateboard
          wheelTextureURLs={wheelTextureURLs}
          wheelTextureURL={wheelTesxtureURL}
          deckTextureURLs={deckTextureURLs}
          deckTextureURL={deckTesxtureURL}
          truckColor={truckColor}
          boltColor={boltColor}
          pose="side"
        />
        <CameraControls
          ref={cameraControls}
          minDistance={0.2}
          maxDistance={4}
          onStart={onCameraControlStart}
        />
      </Suspense>
      <Preload all />
    </Canvas>
  );
}

function StageFloor() {
  const normalMap = useTexture("/concrete-normal.avif");
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(30, 30);
  normalMap.anisotropy = 8;

  const material = new THREE.MeshStandardMaterial({
    roughness: 0.75,
    color: ENVIRONMENT_COLOR,
    normalMap: normalMap,
  });

  return (
    <mesh
      material={material}
      castShadow
      receiveShadow
      position={[0, -0.005, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <circleGeometry args={[20, 32]} />
    </mesh>
  );
}
