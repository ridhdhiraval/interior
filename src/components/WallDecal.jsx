import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

/**
 * WallDecal renders a textured plane aligned to a wall's normal.
 * It uses polygonOffset and a tiny world-space offset to prevent z-fighting.
 */
const WallDecal = ({ position, rotation, size, textureUrl, color, opacity = 1 }) => {
  // Check if textureUrl is actually a image path or a color string
  const isColor = textureUrl && (textureUrl.startsWith('#') || textureUrl.startsWith('rgb') || textureUrl.length <= 7);
  const finalTextureUrl = isColor ? null : textureUrl;
  const finalColor = isColor ? textureUrl : (color || '#ffffff');

  const texture = useLoader(THREE.TextureLoader, finalTextureUrl || '/placeholder.png', (loader) => {
    // Only try to load if it's not a color
    if (isColor) return;
  });
  
  const material = useMemo(() => {
    const props = {
      transparent: true,
      opacity: opacity,
      roughness: 1,
      metalness: 0,
      side: THREE.FrontSide,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -4,
    };

    if (finalTextureUrl && texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      props.map = texture;
      props.color = '#ffffff';
    } else {
      props.color = finalColor;
    }

    return <meshStandardMaterial {...props} />;
  }, [texture, finalTextureUrl, finalColor, opacity]);

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[size[0], size[1]]} />
      {material}
    </mesh>
  );
};


export default WallDecal;
