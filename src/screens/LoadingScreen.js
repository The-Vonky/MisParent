import React, { useEffect } from 'react';
import { View, Dimensions, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import Cloud from '../components/Cloud'; // Caminho correto!

const { width, height } = Dimensions.get('window');
const CIRCLE_SIZE = 250;

export default function LoadingScreen({ navigation }) {
  const orangeY = useSharedValue(-CIRCLE_SIZE * 1.5);
  const blueY = useSharedValue(-CIRCLE_SIZE * 1.5);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    orangeY.value = withTiming(height / 4, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    });

    blueY.value = withTiming(height / 2, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    });

    setTimeout(() => {
      logoOpacity.value = withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      });

      setTimeout(() => runOnJS(navigation.replace)('Login'), 2000);
    }, 2000);
  }, []);

  const orangeStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: orangeY.value,
    left: width / 2 - CIRCLE_SIZE * 1.2,
  }));

  const blueStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: blueY.value,
    left: width / 2 + CIRCLE_SIZE * 0.1,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={orangeStyle}>
        <Cloud size={CIRCLE_SIZE} color="#F58220" />
      </Animated.View>
      <Animated.View style={blueStyle}>
        <Cloud size={CIRCLE_SIZE * 1.2} color="#1C1C9C" />
      </Animated.View>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require('../../assets/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: height / 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 100,
  },
});
