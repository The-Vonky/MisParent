import React from 'react';
import Svg, { Circle, Ellipse } from 'react-native-svg';

export default function Cloud({ size = 100, color = '#90caf9' }) {
  return (
    <Svg width={size} height={size * 0.6} viewBox="0 0 64 40">
      <Circle cx="20" cy="20" r="15" fill={color} />
      <Circle cx="40" cy="20" r="15" fill={color} />
      <Ellipse cx="30" cy="28" rx="25" ry="15" fill={color} />
    </Svg>
  );
}
