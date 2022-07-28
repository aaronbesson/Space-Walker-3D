import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useRef } from "react";
import {
  Dimensions, View
} from "react-native";
import { SensorType, useAnimatedSensor } from "react-native-reanimated";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const { width, height } = Dimensions.get("window");

const Scene = ({ animatedSensor }) => {
  const material = useLoader(MTLLoader, require("./assets/images/saturn.mtl"));
  const obj = useLoader(
    OBJLoader,
    require("./assets/images/saturn.obj"),
    (loader) => {
      material.preload();
      loader.setMaterials(material);
    }
  );

  useLayoutEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.bumpScale = 0.16;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [obj]);

  const mesh = useRef();

  useFrame((state, delta) => {
    let { x, y, z } = animatedSensor.sensor.value;
    x = ~~(x * 100) / 30000;
    y = ~~(y * 100) / 30000;
    mesh.current.rotation.x += x;
    mesh.current.rotation.y += y;
  });

  return (
    <group>
      <primitive
        castShadow
        ref={mesh}
        rotation={[0.1, 0.3, 0]}
        object={obj}
        scale={0.02}
      />
    </group>
  );
};

export default function Comet() {
  const animatedSensor = useAnimatedSensor(SensorType.GYROSCOPE, {
    interval: 100,
  });

  return (
        <View
          style={{
            height: height,
            width: width,
            position: "absolute",
            zIndex: 3,
            top: 0,
          }}
          pointerEvents="none"
        >
          <Canvas shadows colorManagement>
            <ambientLight intensity={0.4} />
            <Suspense fallback={null}>
              <Scene animatedSensor={animatedSensor} />
            </Suspense>
          </Canvas>
        </View>

  );
}
