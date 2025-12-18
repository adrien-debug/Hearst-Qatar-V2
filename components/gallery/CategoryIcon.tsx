/**
 * Icônes vectorielles pour les catégories
 * Style Hearst - Pas d'emojis
 */

interface CategoryIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export default function CategoryIcon({ icon, size = 16, className = '' }: CategoryIconProps) {
  const iconMap: Record<string, JSX.Element> = {
    // Tous (Factory)
    factory: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9 21V8l-6 4v9h6zM9 21h6V3l-6 5v13zM15 21h6v-7l-6-4v11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    
    // Lightning (Transformateurs)
    lightning: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    
    // Cube (Conteneurs)
    cube: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    
    // Snowflake (Refroidissement)
    snowflake: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2v20M17 7l-5 5-5-5M17 17l-5-5-5 5M2 12h20M7 7l5 5 5-5M7 17l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    
    // Battery (Énergie)
    battery: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="1" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M5 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    
    // Tool (Distribution)
    tool: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    
    // Cog (Générateurs)
    cog: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  };

  return iconMap[icon] || iconMap.factory;
}














