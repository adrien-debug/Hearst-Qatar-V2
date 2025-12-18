/**
 * Sol en graviers pour zones sécurisées
 * Texture procédurale réaliste avec relief
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface GravelGroundProps {
  width: number;
  depth: number;
  position?: [number, number, number];
  thickness?: number;
  color?: string;
  roughness?: number;
}

/**
 * Composant de sol en graviers avec texture procédurale
 */
export default function GravelGround({
  width,
  depth,
  position = [0, 0, 0],
  thickness = 0.15,
  color = '#bdc3c7',
  roughness = 0.95,
}: GravelGroundProps) {
  
  // Créer une texture procédurale de graviers
  const gravelTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Fond de base (gris clair)
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 512);
    
    // Ajouter des graviers individuels (petites pierres)
    const numGravels = 800;
    for (let i = 0; i < numGravels; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 8 + 2; // 2-10px
      
      // Variations de couleur pour réalisme
      const brightness = Math.random() * 60 - 30; // -30 à +30
      const r = parseInt(color.slice(1, 3), 16) + brightness;
      const g = parseInt(color.slice(3, 5), 16) + brightness;
      const b = parseInt(color.slice(5, 7), 16) + brightness;
      
      ctx.fillStyle = `rgb(${Math.max(0, Math.min(255, r))}, ${Math.max(0, Math.min(255, g))}, ${Math.max(0, Math.min(255, b))})`;
      
      // Dessiner un gravier (forme irrégulière)
      ctx.beginPath();
      const sides = 5 + Math.floor(Math.random() * 3); // 5-7 côtés
      for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * Math.PI * 2;
        const radius = size * (0.8 + Math.random() * 0.4);
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (j === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fill();
      
      // Ombre légère pour relief
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      ctx.arc(x + 1, y + 1, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(width / 4, depth / 4); // Répéter tous les 4m
    
    return texture;
  }, [width, depth, color]);
  
  // Créer une normal map pour le relief
  const normalMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Fond neutre (normal pointant vers le haut)
    ctx.fillStyle = '#8080ff';
    ctx.fillRect(0, 0, 512, 512);
    
    // Ajouter des variations de relief
    const numBumps = 400;
    for (let i = 0; i < numBumps; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 12 + 4;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, '#a0a0ff'); // Centre plus clair (relief vers le haut)
      gradient.addColorStop(1, '#8080ff'); // Bord neutre
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(width / 4, depth / 4);
    
    return texture;
  }, [width, depth]);
  
  return (
    <group position={position}>
      {/* Couche de graviers principale */}
      <mesh receiveShadow position={[0, thickness / 2, 0]}>
        <boxGeometry args={[width, thickness, depth]} />
        <meshStandardMaterial
          map={gravelTexture}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.3, 0.3)}
          color={color}
          roughness={roughness}
          metalness={0.05}
        />
      </mesh>
      
      {/* Bordures délimitées (optionnel - petits murets de retenue) */}
      <group>
        {/* Bordure avant */}
        <mesh castShadow receiveShadow position={[0, 0.05, depth / 2]}>
          <boxGeometry args={[width, 0.1, 0.1]} />
          <meshStandardMaterial color="#95a5a6" roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Bordure arrière */}
        <mesh castShadow receiveShadow position={[0, 0.05, -depth / 2]}>
          <boxGeometry args={[width, 0.1, 0.1]} />
          <meshStandardMaterial color="#95a5a6" roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Bordure gauche */}
        <mesh castShadow receiveShadow position={[-width / 2, 0.05, 0]}>
          <boxGeometry args={[0.1, 0.1, depth]} />
          <meshStandardMaterial color="#95a5a6" roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Bordure droite */}
        <mesh castShadow receiveShadow position={[width / 2, 0.05, 0]}>
          <boxGeometry args={[0.1, 0.1, depth]} />
          <meshStandardMaterial color="#95a5a6" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Variante simplifiée sans bordures
 */
export function GravelGroundSimple({
  width,
  depth,
  position = [0, 0, 0],
  thickness = 0.15,
  color = '#bdc3c7',
  roughness = 0.95,
}: GravelGroundProps) {
  
  const gravelTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 256, 256);
    
    // Graviers simplifiés
    const numGravels = 300;
    for (let i = 0; i < numGravels; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const size = Math.random() * 4 + 1;
      
      const brightness = Math.random() * 40 - 20;
      const r = parseInt(color.slice(1, 3), 16) + brightness;
      const g = parseInt(color.slice(3, 5), 16) + brightness;
      const b = parseInt(color.slice(5, 7), 16) + brightness;
      
      ctx.fillStyle = `rgb(${Math.max(0, Math.min(255, r))}, ${Math.max(0, Math.min(255, g))}, ${Math.max(0, Math.min(255, b))})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(width / 3, depth / 3);
    
    return texture;
  }, [width, depth, color]);
  
  return (
    <mesh receiveShadow position={[position[0], position[1] + thickness / 2, position[2]]}>
      <boxGeometry args={[width, thickness, depth]} />
      <meshStandardMaterial
        map={gravelTexture}
        color={color}
        roughness={roughness}
        metalness={0.05}
      />
    </mesh>
  );
}




