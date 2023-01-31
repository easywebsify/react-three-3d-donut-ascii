import "./styles.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { AsciiEffect } from "three-stdlib";

function Torus() {
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.rotation.x = ref.current.rotation.y += delta / 2;
  });
  return (
    <mesh ref={ref} scale={1}>
      <torusGeometry args={[1, 0.4, 12, 48]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function AsciiRenderer({
  renderIndex = 1,
  characters = " 0",
  invert = true,
  color = false,
  resolution = 0.15,
  fgColor,
  bgColor
}) {
  const { size, gl, scene, camera } = useThree();
  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, {
      invert,
      color,
      resolution
    });
    effect.domElement.style.position = "absolute";
    effect.domElement.style.top = "0px";
    effect.domElement.style.left = "0px";
    effect.domElement.style.pointerEvents = "none";
    return effect;
  }, [characters, invert, color, resolution]);
  useLayoutEffect(() => {
    effect.domElement.style.color = fgColor;
    effect.domElement.style.backgroundColor = bgColor;
  }, [fgColor, bgColor]);
  useEffect(() => {
    gl.domElement.style.opacity = "0";
    gl.domElement.parentNode.appendChild(effect.domElement);
    return () => {
      gl.domElement.style.opacity = "1";
      gl.domElement.parentNode.removeChild(effect.domElement);
    };
  }, [effect]);
  useEffect(
    () => {
      effect.setSize(size.width, size.height);
    },
    effect,
    size
  );

  useFrame((state) => {
    effect.render(scene, camera);
  }, renderIndex);
}

export default function App() {
  return (
    <div className="App">
      <Canvas>
        <color attach="background" args={["black"]} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Torus />
        <OrbitControls />
        <AsciiRenderer fgColor="white" bgColor="black" />
      </Canvas>
    </div>
  );
}
