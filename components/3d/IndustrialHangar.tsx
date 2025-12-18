import React, { useMemo } from 'react';
import { Box, Shape } from '@react-three/drei';
import * as THREE from 'three';
import { GroupProps } from '@react-three/fiber';

interface IndustrialHangarProps extends GroupProps {
  width?: number; // Largeur (X)
  length?: number; // Profondeur (Z)
  height?: number; // Hauteur murs (Y)
  roofHeight?: number; // Hauteur ajoutée par le toit
  color?: string; // Couleur principale (murs)
  roofColor?: string; // Couleur toit
  doorOpen?: boolean; // Porte ouverte ?
}

export default function IndustrialHangar({
  width = 20,
  length = 30,
  height = 8,
  roofHeight = 3,
  color = '#bdc3c7', // Gris clair / Tôle
  roofColor = '#7f8c8d', // Gris foncé
  doorOpen = true,
  ...props
}: IndustrialHangarProps) {

  // --- GÉOMÉTRIE DU TOIT (Extrusion triangulaire) ---
  const roofGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Dessin du profil du toit (Triangle)
    // On part du coin haut-gauche (-w/2, 0) -> Pointe (0, h) -> Haut-droite (w/2, 0)
    shape.moveTo(-width / 2 - 0.5, 0); // Débord gauche
    shape.lineTo(0, roofHeight);      // Pointe
    shape.lineTo(width / 2 + 0.5, 0);  // Débord droite
    shape.lineTo(-width / 2 - 0.5, 0); // Fermeture
    
    // Extrusion sur la longueur (Z)
    const extrudeSettings = {
      steps: 1,
      depth: length + 1, // Débord avant/arrière
      bevelEnabled: false,
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [width, length, roofHeight]);

  // --- MATÉRIAUX ---
  // Tôle murs (légèrement brillant)
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.5,
    metalness: 0.4,
    flatShading: true, // Donne un petit côté facetté sympa
  });

  // Tôle toit
  const roofMaterial = new THREE.MeshStandardMaterial({
    color: roofColor,
    roughness: 0.7,
    metalness: 0.2,
  });

  // Structure interne (Poutres acier IPN) - Gris foncé
  const steelMaterial = new THREE.MeshStandardMaterial({
    color: '#2c3e50',
    roughness: 0.8,
    metalness: 0.1,
  });

  // Sol intérieur (Béton)
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: '#95a5a6',
    roughness: 0.9,
    metalness: 0.1,
  });

  // Route intérieure (Extension de la route extérieure)
  const internalRoadMaterial = new THREE.MeshStandardMaterial({
    color: '#333333', // Bitume foncé comme les routes extérieures
    roughness: 0.8,
    metalness: 0.1,
  });

  // --- CONSTANTES GÉOMÉTRIQUES ---
  // Définies AVANT le return JSX pour éviter l'erreur de syntaxe
  const doorW = 8;
  const doorH = 5;
  const sidePanelW = (width - doorW) / 2;

  return (
    <group {...props}>
      {/* 1. MURS LATÉRAUX (Gauche et Droite) */}
      {/* Mur Gauche (Ouest) */}
      <mesh position={[-width / 2, height / 2, 0]} castShadow receiveShadow material={wallMaterial}>
        <boxGeometry args={[0.3, height, length]} />
      </mesh>
      {/* Mur Droit (Est) */}
      <mesh position={[width / 2, height / 2, 0]} castShadow receiveShadow material={wallMaterial}>
        <boxGeometry args={[0.3, height, length]} />
      </mesh>

      {/* 2. MUR FOND (Nord, Z-) */}
      <mesh position={[0, height / 2, -length / 2]} castShadow receiveShadow material={wallMaterial}>
        <boxGeometry args={[width, height, 0.3]} />
      </mesh>

      {/* 3. FAÇADE AVANT (Sud, Z+) AVEC OUVERTURE PORTE */}
      {/* On fait 2 panneaux latéraux + 1 panneau haut pour laisser le trou de la porte */}
      
      {/* Panneau Gauche Porte */}
      <mesh position={[-width/2 + sidePanelW/2, height/2, length/2]} castShadow receiveShadow material={wallMaterial}>
        <boxGeometry args={[sidePanelW, height, 0.3]} />
      </mesh>
      {/* Panneau Droit Porte */}
      <mesh position={[width/2 - sidePanelW/2, height/2, length/2]} castShadow receiveShadow material={wallMaterial}>
        <boxGeometry args={[sidePanelW, height, 0.3]} />
      </mesh>
      {/* Linteau (Au-dessus porte) */}
      <mesh position={[0, height - (height - doorH)/2, length/2]} castShadow receiveShadow material={wallMaterial}>
        <boxGeometry args={[doorW, height - doorH, 0.3]} />
      </mesh>

      {/* 4. PORTE SECTIONNELLE (Ouverte ou Fermée) */}
      <group position={[0, doorOpen ? doorH - 0.5 : doorH/2, length/2]}>
         {/* Si ouverte, on la remonte et on la "roule" ou juste stockée en haut */}
         {/* Ici on simule une porte levée : on affiche juste un petit bout qui dépasse ou le panneau complet en haut */}
         <mesh castShadow receiveShadow>
           <boxGeometry args={[doorW - 0.2, doorOpen ? 1 : doorH, 0.4]} />
           <meshStandardMaterial color="#34495e" roughness={0.4} />
         </mesh>
      </group>


      {/* 5. TOITURE */}
      {/* Le pivot de l'extrusion est au (0,0) du shape. On doit le placer en haut des murs. */}
      {/* L'extrusion se fait sur Z positif par défaut. On centre. */}
      <mesh 
        geometry={roofGeometry} 
        material={roofMaterial} 
        position={[0, height, -length/2 - 0.5]} // -0.5 car depth = length + 1
        castShadow 
        receiveShadow
      />
      {/* Triangle de pignon avant et arrière (pour fermer le trou entre mur et toit) */}
      
       {/* Correction Pignons : On réutilise l'extrusion mais très fine */}
      <mesh position={[0, height, -length/2]} material={wallMaterial}>
        <extrudeGeometry args={[
          new THREE.Shape().moveTo(-width/2,0).lineTo(0,roofHeight).lineTo(width/2,0).lineTo(-width/2,0),
          { depth: 0.3, bevelEnabled: false }
        ]} />
      </mesh>
      <mesh position={[0, height, length/2 - 0.3]} material={wallMaterial}>
        <extrudeGeometry args={[
          new THREE.Shape().moveTo(-width/2,0).lineTo(0,roofHeight).lineTo(width/2,0).lineTo(-width/2,0),
          { depth: 0.3, bevelEnabled: false }
        ]} />
      </mesh>


      {/* 6. SOL INTÉRIEUR (Dalle Béton) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow material={floorMaterial}>
        <planeGeometry args={[width - 0.6, length - 0.6]} />
      </mesh>

      {/* 6b. ROUTE INTÉRIEURE (Extension + Sortie) */}
      {/* Une bande de bitume qui va du fond jusqu'à l'extérieur (dépassement de 4m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 2]} receiveShadow material={internalRoadMaterial}>
        <planeGeometry args={[doorW - 1, length - 0.6 + 4]} /> 
      </mesh>

      {/* 7. STRUCTURE POTEAUX (Pour le réalisme intérieur) */}
      {/* On en met tous les 5 mètres */}
      {Array.from({ length: Math.floor(length / 5) + 1 }).map((_, i, arr) => {
        const z = -length/2 + i * (length / (arr.length - 1));
        return (
          <group key={i} position={[0, 0, z]}>
            {/* Poteau Gauche */}
            <mesh position={[-width/2 + 0.3, height/2, 0]} material={steelMaterial}>
              <boxGeometry args={[0.4, height, 0.4]} />
            </mesh>
            {/* Poteau Droit */}
            <mesh position={[width/2 - 0.3, height/2, 0]} material={steelMaterial}>
              <boxGeometry args={[0.4, height, 0.4]} />
            </mesh>
            {/* Traverse Toit (Ferme) */}
            {/* Simplifié par une poutre horizontale haute */}
            <mesh position={[0, height - 0.5, 0]} material={steelMaterial}>
              <boxGeometry args={[width, 0.4, 0.4]} />
            </mesh>
          </group>
        );
      })}

    </group>
  );
}
