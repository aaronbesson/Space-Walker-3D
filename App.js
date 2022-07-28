import { Dimensions, Image, LogBox, StyleSheet, View } from "react-native";
import Animated, { SlideInDown, SlideInUp } from "react-native-reanimated";

import Comet from "./Comet";
import Earth from "./Earth";
import SpaceMan from "./SpaceMan";

const { width, height } = Dimensions.get("window");

LogBox.ignoreAllLogs(true);

export default function App() {


  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>

      <Animated.View
      entering={SlideInUp.duration(7400)}>
        <Comet />
        </Animated.View>
        <Animated.View
      entering={SlideInDown.duration(5400)}>
      <Earth />
      </Animated.View>
      <Animated.View
      style={{flex: 1}}
      entering={SlideInDown.duration(6500)}>
      <SpaceMan />
      </Animated.View>
      <Image
        source={require("./assets/stars.png")}
        style={styles.stars}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  image: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  stars: {
    position: "absolute",
    zIndex: -1,
    width: width,
    height: height,
    opacity: 1,
  }
});
