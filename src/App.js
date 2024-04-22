import React from "react";
import { Routes, Route } from "react-router-dom";
import { Vector3 } from "three";
import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, SpotLight, useDepthBuffer } from "@react-three/drei";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [-2, 2, 6], fov: 50, near: 1, far: 20 }}
        >
          <color attach="background" args={["#202020"]} />
          <fog attach="fog" args={["#202020", 0, 20]} />
          <ambientLight intensity={0.015} />
          <Scene />
        </Canvas>
      </div>

      {/* Routes */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          top: "10%",
          display: "flex",
          justifyContent: "center",
          fontFamily: "'Monoton', sans-serif",
          color: "white",
          fontSize: "40px",
        }}
      >
        CHATIFY
      </div>
      <div style={{ position: "relative", zIndex: 1, top: "50%" }}>
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

function Scene() {
  // This is a super cheap depth buffer that only renders once (frames: 1 is optional!), which works well for static scenes
  // Spots can optionally use that for realism, learn about soft particles here: http://john-chapman-graphics.blogspot.com/2013/01/good-enough-volumetrics-for-spotlights.html
  const depthBuffer = useDepthBuffer({ frames: 1 });
  const { nodes, materials } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/dragon/model.gltf"
  );
  return (
    <>
      <MovingSpot
        depthBuffer={depthBuffer}
        color="white"
        position={[3, 3, 2]}
      />
      <MovingSpot
        depthBuffer={depthBuffer}
        color="#b00c3f"
        position={[1, 3, 0]}
      />
      <mesh
        position={[0, -1.03, 0]}
        castShadow
        receiveShadow
        geometry={nodes.dragon.geometry}
        material={materials["Default OBJ.001"]}
        dispose={null}
      />
      <mesh receiveShadow position={[0, -1, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[50, 50]} />
        <meshPhongMaterial />
      </mesh>
    </>
  );
}

function MovingSpot({ vec = new Vector3(), ...props }) {
  const light = useRef();
  const viewport = useThree((state) => state.viewport);
  useFrame((state) => {
    light.current.target.position.lerp(
      vec.set(
        (state.mouse.x * viewport.width) / 2,
        (state.mouse.y * viewport.height) / 2,
        0
      ),
      0.1
    );
    light.current.target.updateMatrixWorld();
  });
  return (
    <SpotLight
      castShadow
      ref={light}
      penumbra={1}
      distance={6}
      angle={0.35}
      attenuation={5}
      anglePower={10}
      intensity={100}
      {...props}
    />
  );
}
