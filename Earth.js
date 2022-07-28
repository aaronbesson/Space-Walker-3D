import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "expo-three";
import { Suspense, useLayoutEffect, useRef } from "react";
import {
  Dimensions, View
} from "react-native";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { SensorType, useAnimatedSensor } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// This texture will be immediately ready but it'll load asynchronously
const texture = new TextureLoader().load(require("./assets/images/earth_3.jpg"));

const Scene = ({ animatedSensor }) => {
  const [diffuse, bump, specular] = useLoader(TextureLoader, [
    require("./assets/images/earth_3.jpg"),
    require("./assets/images/earth_normal.jpg"),
    // require("./assets/images/metallicTexture&earth_roughness_1.jpg"),
  ]);

  const material = useLoader(MTLLoader, require("./assets/images/earth.mtl"));

  const obj = useLoader(
    OBJLoader,
    require("./assets/images/earth.obj"),
    (loader) => {
      material.preload();
      loader.setMaterials(material);
    }
  );

  useLayoutEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = texture;
        child.material.bumpMap = bump;
        child.material.bumpScale = 0.16;
        child.material.specularMap = specular;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [obj]);

  const mesh = useRef();

  useFrame((state, delta) => {
    let { x, y, z } = animatedSensor.sensor.value;
    x = ~~(x * 100) / 15000;
    y = ~~(y * 100) / 7000;
    mesh.current.rotation.x += x;
    mesh.current.rotation.y += y;
  });

  return (
    <group>
      <primitive
        castShadow
        ref={mesh}
        rotation={[0.2, 4, 0]}
        object={obj}
        scale={0.02}
      />
    </group>
  );
};

export default function Earth() {
  const animatedSensor = useAnimatedSensor(SensorType.GYROSCOPE, {
    interval: 100,
  });

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
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
    </View>
  );
}
