interface NotificationCenterProps {
  problems: {
    substation: any[];
    sections: Array<{
      section: number;
      problems: Array<{
        type: 'warning' | 'error';
        message: string;
        items?: string[];
      }>;
      hasProblems: boolean;
    }>;
    transformers: any[];
    containers: any[];
  };
  totalProblems: number;
}

export default function NotificationCenter({ problems, totalProblems }: NotificationCenterProps) {
  return (
    <div className="bg-white rounded-[8px] p-6 border border-[#e2e8f0] hover:border-[#8AFD81]/30 transition-all duration-300 shadow-sm w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-[#8AFD81]/20 flex items-center justify-center border border-[#8AFD81]/20">
            <svg className="w-6 h-6 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#0b1120] tracking-tight">Centre de notifications</h3>
        </div>
        {totalProblems > 0 && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-bold">
            {totalProblems}
          </div>
        )}
      </div>
      
      {totalProblems === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#8AFD81]/20 flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-base text-[#0b1120] font-medium">Aucun problème détecté</p>
          <p className="text-sm text-[#64748b] mt-1">Tous les systèmes fonctionnent normalement</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Problèmes Substation */}
          {problems.substation.length > 0 && (
            <div className="pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-5 bg-[#64748b] rounded-full"></div>
                <span className="text-sm font-semibold text-[#0b1120]">Substation</span>
              </div>
              {problems.substation.map((problem, idx) => (
                <div key={idx} className="ml-4 text-sm text-[#64748b]">{problem}</div>
              ))}
            </div>
          )}
          
          {/* Problèmes Sections */}
          {problems.sections.filter(s => s.hasProblems).map((section) => (
            <div key={section.section} className="pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-5 bg-[#64748b] rounded-full"></div>
                <span className="text-sm font-semibold text-[#0b1120]">Section {section.section}</span>
              </div>
              {section.problems.map((problem, idx) => (
                <div key={idx} className="ml-4 mb-2">
                  <div className={`text-sm font-medium mb-1 ${
                    problem.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {problem.message}
                  </div>
                  {problem.items && problem.items.length > 0 && (
                    <div className="ml-3 text-xs text-[#64748b]">
                      {problem.items.slice(0, 3).join(', ')}
                      {problem.items.length > 3 && ` +${problem.items.length - 3}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          
          {/* Problèmes Transformateurs */}
          {problems.transformers.length > 0 && (
            <div className="pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-5 bg-[#64748b] rounded-full"></div>
                <span className="text-sm font-semibold text-[#0b1120]">Transformateurs</span>
              </div>
              {problems.transformers.map((transformer, idx) => (
                <div key={idx} className="ml-4 text-sm text-[#64748b]">{transformer.name} - Problème détecté</div>
              ))}
            </div>
          )}
          
          {/* Résumé Conteneurs */}
          {problems.containers.length > 0 && (
            <div className="pb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-5 bg-[#64748b] rounded-full"></div>
                <span className="text-sm font-semibold text-[#0b1120]">Conteneurs</span>
              </div>
              <div className="ml-4 text-sm text-[#64748b] font-medium mb-1">
                {problems.containers.length} conteneur(s) nécessitent une attention
              </div>
              <div className="ml-4 text-xs text-[#64748b]">
                {problems.containers.slice(0, 4).map(c => c.name).join(', ')}
                {problems.containers.length > 4 && ` +${problems.containers.length - 4}`}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

