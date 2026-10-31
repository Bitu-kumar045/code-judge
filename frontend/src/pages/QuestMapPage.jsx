import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  WORLDS, 
  getPlayerState, 
  getTotalStars 
} from '../utils/gamification';
import { 
  Gamepad2, 
  Sparkles, 
  Layers, 
  Hash, 
  Maximize2, 
  ChevronsLeftRight, 
  GitCommit, 
  Archive, 
  Target, 
  FolderTree, 
  Cpu, 
  Network, 
  Compass, 
  Star, 
  Lock, 
  Unlock, 
  Flame, 
  Gem, 
  Trophy, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2,
  Skull
} from 'lucide-react';

const ICON_MAP = {
  Sparkles,
  Layers,
  Hash,
  Maximize2,
  ChevronsLeftRight,
  GitCommit,
  Archive,
  Target,
  FolderTree,
  Cpu,
  Network,
  Compass,
};

export default function QuestMapPage() {
  const [player, setPlayer] = useState(getPlayerState());
  const [selectedWorld, setSelectedWorld] = useState(null);

  useEffect(() => {
    setPlayer(getPlayerState());
  }, []);

  const totalStars = getTotalStars(player.completedStages);
  const maxStarsPossible = WORLDS.reduce((acc, w) => acc + (w.stages.length * 3), 0);
  const xpPercent = Math.min(100, Math.round((player.xp / player.nextLevelXp) * 100));

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#7C3AED]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Top Header & Player HUD Banner */}
        <div className="bg-[#12182F] border border-[#1E294B] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Player Info & Avatar */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#6366F1] to-[#34D399] p-0.5 shadow-xl shadow-purple-600/20">
                  <div className="h-full w-full bg-[#0B1020] rounded-[14px] flex items-center justify-center font-display font-extrabold text-2xl text-white">
                    {player.username.charAt(0)}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-500 text-[#0B1020] font-black text-[10px] uppercase shadow">
                  Lv.{player.level}
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-display font-extrabold tracking-tight text-white">
                    {player.username}
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/40 font-semibold">
                    {player.title}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Algorithmic RPG Campaign • Complete stages to unlock worlds & conquer boss algorithms.
                </p>
              </div>
            </div>

            {/* Campaign Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Stars */}
              <div className="bg-[#0B1020] border border-[#1E294B] px-3.5 py-2.5 rounded-xl flex items-center space-x-2.5">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                <div>
                  <div className="text-sm font-bold text-white">{totalStars} <span className="text-slate-500 text-xs">/ {maxStarsPossible}</span></div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Stars Earned</div>
                </div>
              </div>

              {/* XP */}
              <div className="bg-[#0B1020] border border-[#1E294B] px-3.5 py-2.5 rounded-xl flex items-center space-x-2.5">
                <Sparkles className="h-5 w-5 text-[#A78BFA]" />
                <div>
                  <div className="text-sm font-bold text-white">{player.xp} <span className="text-slate-500 text-xs">/ {player.nextLevelXp}</span></div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">XP to Next Lv</div>
                </div>
              </div>

              {/* Streak */}
              <div className="bg-[#0B1020] border border-[#1E294B] px-3.5 py-2.5 rounded-xl flex items-center space-x-2.5">
                <Flame className="h-5 w-5 text-orange-400 fill-orange-400" />
                <div>
                  <div className="text-sm font-bold text-white">{player.streakDays} Days</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Streak Blaze</div>
                </div>
              </div>

              {/* Rating */}
              <div className="bg-[#0B1020] border border-[#1E294B] px-3.5 py-2.5 rounded-xl flex items-center space-x-2.5">
                <Trophy className="h-5 w-5 text-[#34D399]" />
                <div>
                  <div className="text-sm font-bold text-white">{player.eloRating} Elo</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Duel Rating</div>
                </div>
              </div>

            </div>

          </div>

          {/* Level Progress Bar */}
          <div className="mt-5 pt-4 border-t border-[#1E294B]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-400">
              <span>Level Progress</span>
              <div className="w-48 bg-[#0B1020] h-2.5 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#34D399] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-white font-mono font-bold">{xpPercent}%</span>
            </div>

            <div className="flex items-center space-x-3">
              <Link 
                to="/problems" 
                className="text-xs text-slate-400 hover:text-white transition-colors underline decoration-slate-600 underline-offset-4"
              >
                Switch to Classic Table View (2,000 Questions) →
              </Link>
            </div>
          </div>
        </div>

        {/* Spaced Repetition / Memory Forge Section */}
        {player.revisionQueue && player.revisionQueue.length > 0 && (
          <div className="bg-gradient-to-r from-[#12182F] to-[#161F3C] border border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <RotateCcw className="h-5 w-5 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Memory Forge (Spaced Repetition)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                    {player.revisionQueue.length} Due for Review
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Scientifically proven 1, 3, 7-day recall triggers so you retain algorithmic intuition forever.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
              {player.revisionQueue.map((item) => (
                <Link
                  key={item.slug}
                  to={`/problems/${item.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[#1E294B] hover:border-amber-400/60 text-xs text-slate-200 hover:text-white flex items-center space-x-1.5 transition-all whitespace-nowrap shadow-sm"
                >
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-[10px] text-amber-400 font-mono">({item.interval})</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quest Map Worlds Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-white">Campaign Worlds</h2>
              <p className="text-xs text-slate-400">Battle through sequential algorithmic realms to forge true mastery.</p>
            </div>
            <div className="text-xs text-slate-400">
              World 1 through 12 Active
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WORLDS.map((world, index) => {
              const isUnlocked = totalStars >= world.requiredStars;
              const IconComponent = ICON_MAP[world.icon] || Sparkles;

              // Calculate world stats
              const worldStars = world.stages.reduce((acc, st) => acc + (player.completedStages[st.id] || 0), 0);
              const maxWorldStars = world.stages.length * 3;
              const isCleared = worldStars === maxWorldStars;

              return (
                <div
                  key={world.id}
                  className={`relative rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                    isUnlocked 
                      ? 'bg-[#12182F] border-[#1E294B] hover:border-[#7C3AED]/60 hover:shadow-xl hover:shadow-purple-900/20' 
                      : 'bg-[#0E1428]/60 border-[#1E294B]/40 opacity-70'
                  }`}
                >
                  {/* Top Realm Badge & Gradient banner */}
                  <div className={`h-2.5 bg-gradient-to-r ${world.color}`} />

                  <div className="p-5 space-y-4 flex-1">
                    
                    {/* Header: Icon, World Name, Lock Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="h-11 w-11 rounded-xl flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: `${world.accent}20`, border: `1px solid ${world.accent}40` }}
                        >
                          <IconComponent className="h-5 w-5" style={{ color: world.accent }} />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-base text-white">
                            {world.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-1">{world.subtitle}</p>
                        </div>
                      </div>

                      {/* Lock/Unlock Badge */}
                      {isUnlocked ? (
                        <div className="flex items-center space-x-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Star className="h-3.5 w-3.5 fill-amber-400" />
                          <span>{worldStars}/{maxWorldStars}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                          <Lock className="h-3 w-3" />
                          <span>Req {world.requiredStars} ⭐</span>
                        </div>
                      )}
                    </div>

                    {/* Stages in World */}
                    <div className="space-y-2 pt-2">
                      {world.stages.map((stage) => {
                        const stageStars = player.completedStages[stage.id] || 0;
                        const isStageCleared = stageStars > 0;

                        return (
                          <div
                            key={stage.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                              stage.isBoss
                                ? 'bg-rose-950/20 border-rose-500/30'
                                : isStageCleared
                                ? 'bg-[#0B1020] border-emerald-500/30'
                                : 'bg-[#0B1020] border-[#1E294B]'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              {stage.isBoss ? (
                                <div className="p-1 rounded bg-rose-500/20 text-rose-400">
                                  <Skull className="h-3.5 w-3.5" />
                                </div>
                              ) : isStageCleared ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border border-slate-600 shrink-0 flex items-center justify-center text-[9px] font-mono text-slate-400">
                                  {stage.num}
                                </div>
                              )}
                              <div className="truncate">
                                <span className={`font-semibold ${stage.isBoss ? 'text-rose-300 font-bold' : 'text-slate-200'}`}>
                                  {stage.title}
                                </span>
                                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono mt-0.5">
                                  <span className={
                                    stage.level === 'EASY' ? 'text-emerald-400' :
                                    stage.level === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'
                                  }>
                                    {stage.level}
                                  </span>
                                  <span>•</span>
                                  <span className="text-[#A78BFA]">+{stage.xp} XP</span>
                                </div>
                              </div>
                            </div>

                            {/* Stars rating */}
                            <div className="flex items-center space-x-0.5 pl-2 shrink-0">
                              {[1, 2, 3].map((starNum) => (
                                <Star 
                                  key={starNum} 
                                  className={`h-3 w-3 ${
                                    starNum <= stageStars 
                                      ? 'text-amber-400 fill-amber-400' 
                                      : 'text-slate-700'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* World Action Button */}
                  <div className="p-4 pt-0">
                    {isUnlocked ? (
                      <Link
                        to={`/problems/${world.stages[0].slug}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:brightness-110 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-purple-900/30 transition-all"
                      >
                        <span>Enter Realm</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-500 font-semibold text-xs flex items-center justify-center space-x-2 cursor-not-allowed"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>Requires {world.requiredStars} ⭐ To Unlock</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
