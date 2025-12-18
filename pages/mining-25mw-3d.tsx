import React from 'react';
import dynamic from 'next/dynamic';
const Mining25MW3DScene = dynamic(() => import('../components/3d/Mining25MW3DScene'), { ssr: false });

export default function Mining25MW3DPage() {
  return <Mining25MW3DScene />;
}


