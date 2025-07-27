
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Line } from '@react-three/drei';
import { Block } from '@/utils/blockchain';
import * as THREE from 'three';

interface BlockchainVisualizerProps {
  blocks: Block[];
  className?: string;
}

function BlockMesh({ block, position, isLatest }: { block: Block; position: [number, number, number]; isLatest: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      if (isLatest) {
        meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      }
    }
  });

  const color = isLatest ? '#10B981' : '#3B82F6';
  const intensity = isLatest ? 1.2 : 0.8;

  return (
    <group position={position}>
      <Box ref={meshRef} args={[1, 1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.1}
        />
      </Box>
      <Sphere args={[0.1]} position={[0, 1.2, 0]}>
        <meshStandardMaterial 
          color="#F59E0B" 
          emissive="#F59E0B" 
          emissiveIntensity={intensity}
        />
      </Sphere>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Block {block.index}
      </Text>
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.15}
        color="#9CA3AF"
        anchorX="center"
        anchorY="middle"
      >
        {block.transactions.length} TXs
      </Text>
    </group>
  );
}

function ConnectionLine({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  return (
    <Line
      points={points}
      color="#4B5563"
      lineWidth={2}
    />
  );
}

export const BlockchainVisualizer: React.FC<BlockchainVisualizerProps> = ({ blocks, className }) => {
  const blockPositions = useMemo(() => {
    return blocks.map((_, index) => [index * 3 - (blocks.length - 1) * 1.5, 0, 0] as [number, number, number]);
  }, [blocks]);

  return (
    <div className={`h-64 w-full ${className}`}>
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {blocks.map((block, index) => (
          <BlockMesh
            key={block.hash}
            block={block}
            position={blockPositions[index]}
            isLatest={index === blocks.length - 1}
          />
        ))}
        
        {blockPositions.slice(0, -1).map((pos, index) => (
          <ConnectionLine
            key={index}
            start={[pos[0] + 0.5, pos[1], pos[2]]}
            end={[blockPositions[index + 1][0] - 0.5, blockPositions[index + 1][1], blockPositions[index + 1][2]]}
          />
        ))}
      </Canvas>
    </div>
  );
};
