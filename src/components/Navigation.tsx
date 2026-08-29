import React from 'react';
import { Home, Search, FolderKanban, Sparkles, MessageSquare } from 'lucide-react';

export type NavTab = 'home' | 'search' | 'collections' | 'memories' | 'ai';

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadAiAlerts?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  unreadAiAlerts = 1
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'search' as NavTab, label: 'Search', icon: Search },
    { id: 'collections' as NavTab, label: 'Collections', icon: FolderKanban },
    { id: 'memories' as NavTab, label: 'Memories', icon: Sparkles },
    { id: 'ai' as NavTab, label: 'Ask Luma', icon: MessageSquare, badge: unreadAiAlerts }
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-5 pt-2 max-w-lg mx-auto pointer-events-auto"
    >
      <div className="glass-panel-glow rounded-3xl p-1.5 flex items-center justify-between border border-cyan-500/20 shadow-2xl shadow-cyan-950/40 bg-slate-950/80 backdrop-blur-xl">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-3 sm:px-4 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'text-cyan-400 bg-cyan-500/15 shadow-inner shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {/* Active glow dot */}
              {isActive && (
                <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>

              <span className="text-[11px] font-medium tracking-wide mt-1 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
