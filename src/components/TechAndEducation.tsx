import React, { useState } from 'react';
import { Building2, GraduationCap, Server, Database, Globe, Lightbulb, Sparkles, Cpu, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TechAndEducationProps {
  styleMode: 'artistic' | 'geometric';
  playPluck: (freq: number) => void;
}

const TECH_COMPANIES = [
  {
    id: 'alibaba',
    name: '阿里云计算',
    eng: 'Alibaba Cloud',
    icon: <Server className="w-5 h-5" />,
    desc: '2026 最新动态：全息通义大模型（Qwen Holographic）发布，全面赋能杭州智慧城市底层算力。',
    stats: { innovation: '98.7%', density: 'TOP 1%', tag: '云端算力' }
  },
  {
    id: 'netease',
    name: '网易伏羲',
    eng: 'NetEase Fuxi',
    icon: <Globe className="w-5 h-5" />,
    desc: '2026 最新动态：在虚拟现实与具身智能引擎上实现突破，首个AI全自动生成3D物理世界引擎在杭落地。',
    stats: { innovation: '97.2%', density: 'TOP 2%', tag: '具身智能' }
  },
  {
    id: 'hikvision',
    name: '海康威视',
    eng: 'Hikvision',
    icon: <Database className="w-5 h-5" />,
    desc: '2026 最新动态：推出天穹城市感知生态，实现杭州全市域毫秒级多维数据融合感知系统部署。',
    stats: { innovation: '96.5%', density: 'TOP 1.5%', tag: '多维感知' }
  }
];

const UNIVERSITIES = [
  {
    id: 'zju',
    name: '浙江大学',
    eng: 'Zhejiang University',
    icon: <GraduationCap className="w-5 h-5" />,
    desc: '2026 最新动态：紫金港校区落成国家级强人工智能联合实验室，领跑脑机接口（BCI）第三代非侵入式技术。',
    stats: { innovation: '99.4%', density: '学术高峰', tag: '脑机接口' }
  },
  {
    id: 'westlake',
    name: '西湖大学',
    eng: 'Westlake University',
    icon: <Lightbulb className="w-5 h-5" />,
    desc: '2026 最新动态：云谷校区科研团队在量子计算纠错算法取得颠覆性成果，发布《2026深科技先锋报告》。',
    stats: { innovation: '99.1%', density: '世界一流', tag: '量子计算' }
  }
];

const HZ_DRAGONS = [
  {
    id: 'deepseek',
    name: '深度求索',
    eng: 'DeepSeek',
    icon: <Database className="w-5 h-5" />,
    desc: '2026 最新动态：人工智能领军企业，主攻大语言模型研发，代表了中国在新技术领域的顶尖创新力量。',
    stats: { innovation: '99.8%', density: '独角兽', tag: '开源智能' }
  },
  {
    id: 'unitree',
    name: '宇树科技',
    eng: 'Unitree',
    icon: <Globe className="w-5 h-5" />,
    desc: '2026 最新动态：领先的机器人公司，专注于四足机器人和人形机器人的研发制造，深度拓展具身智能。',
    stats: { innovation: '97.9%', density: 'TOP 1%', tag: '具身智能' }
  },
  {
    id: 'gamescience',
    name: '游戏科学',
    eng: 'Game Science',
    icon: <Server className="w-5 h-5" />,
    desc: '2026 最新动态：顶尖游戏开发商，因打造现象级单机大作《黑神话：悟空》而闻名，持续推动中国数字娱乐出海。',
    stats: { innovation: '96.8%', density: '现象级', tag: '数字艺术' }
  },
  {
    id: 'brainco',
    name: '强脑科技',
    eng: 'BrainCo',
    icon: <Lightbulb className="w-5 h-5" />,
    desc: '2026 最新动态：脑机接口领域的独角兽，专注于康复医疗与神经反馈技术，领跑非侵入式脑机接口前沿。',
    stats: { innovation: '95.4%', density: '先驱级', tag: '脑机应用' }
  },
  {
    id: 'kujiale',
    name: '群核科技',
    eng: 'Kujiale',
    icon: <Building2 className="w-5 h-5" />,
    desc: '2026 最新动态：领先的空间智能与云设计软件平台，提供全屋装修设计解决方案，构建全球领先的3D云设计生态。',
    stats: { innovation: '94.2%', density: '独角兽', tag: '空间智能' }
  },
  {
    id: 'deeprobotics',
    name: '云深处科技',
    eng: 'DeepRobotics',
    icon: <Globe className="w-5 h-5" />,
    desc: '2026 最新动态：前沿四足机器人企业，深耕行业级特种机器人的研发，在复杂地形巡检与救援场景应用广泛。',
    stats: { innovation: '95.1%', density: '专业级', tag: '工业四足' }
  }
];

export function TechAndEducation({ styleMode, playPluck }: TechAndEducationProps) {
  const [activeTab, setActiveTab] = useState<'tech' | 'edu' | 'dragons'>('tech');
  const [activeIndex, setActiveIndex] = useState(0);

  const currentData = activeTab === 'tech' ? TECH_COMPANIES : activeTab === 'edu' ? UNIVERSITIES : HZ_DRAGONS;

  const handleTabChange = (tab: 'tech' | 'edu' | 'dragons', baseFreq: number) => {
    setActiveTab(tab);
    setActiveIndex(0);
    playPluck(baseFreq);
  };

  const selectedItem = currentData[activeIndex] || currentData[0];

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-1000 overflow-hidden relative group h-full flex flex-col justify-between
      ${styleMode === 'artistic' 
        ? 'bg-[#eae5da]/40 border-transparent text-zinc-900 shadow-[0_4px_30px_rgba(20,83,45,0.01)]' 
        : 'bg-[#121927]/90 border-cyan-500/10 text-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* Background Decor */}
      {styleMode === 'artistic' ? (
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-zinc-800/5 rounded-full filter blur-3xl pointer-events-none" />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/10 via-indigo-950/5 to-purple-950/10 pointer-events-none" />
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/5 rounded-full filter blur-3xl animate-pulse pointer-events-none" />
        </>
      )}

      <div className="relative z-10 flex flex-col gap-5 w-full h-full justify-between">
        {/* Category Pill Switcher Row (No Header Title) */}
        <div className="flex justify-center border-b pb-3.5 border-[#2c2a25]/10">
          <div className="flex space-x-2 bg-[#fbf9f6]/60 p-1.5 rounded-full border border-[#2c2a25]/5 shadow-sm">
            <button 
              onClick={() => handleTabChange('tech', 330)}
              className={`px-4 py-1.5 text-xs rounded-full transition-all duration-300 flex items-center space-x-1.5
                ${activeTab === 'tech'
                  ? styleMode === 'artistic' 
                    ? 'bg-[#2c2a25] text-white font-bold shadow-md' 
                    : 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                  : styleMode === 'artistic' 
                    ? 'text-[#6e685c] hover:text-[#2c2a25] hover:bg-[#2c2a25]/5' 
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>领军科技</span>
            </button>

            <button 
              onClick={() => handleTabChange('edu', 392)}
              className={`px-4 py-1.5 text-xs rounded-full transition-all duration-300 flex items-center space-x-1.5
                ${activeTab === 'edu'
                  ? styleMode === 'artistic' 
                    ? 'bg-[#2c2a25] text-white font-bold shadow-md' 
                    : 'bg-indigo-500/20 border-indigo-400 text-indigo-300 font-bold'
                  : styleMode === 'artistic' 
                    ? 'text-[#6e685c] hover:text-[#2c2a25] hover:bg-[#2c2a25]/5' 
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>顶尖学府</span>
            </button>

            <button 
              onClick={() => handleTabChange('dragons', 440)}
              className={`px-4 py-1.5 text-xs rounded-full transition-all duration-300 flex items-center space-x-1.5
                ${activeTab === 'dragons'
                  ? styleMode === 'artistic' 
                    ? 'bg-[#2c2a25] text-white font-bold shadow-md' 
                    : 'bg-purple-500/20 border-purple-400 text-purple-300 font-bold'
                  : styleMode === 'artistic' 
                    ? 'text-[#6e685c] hover:text-[#2c2a25] hover:bg-[#2c2a25]/5' 
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>杭州六小龙</span>
            </button>
          </div>
        </div>

        {/* Constellation Cloud & Zen Scroll Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch flex-1 overflow-hidden min-h-0">
          
          {/* Left: Ripple Node Constellation Grid (5 Columns) */}
          <div className="col-span-1 md:col-span-5 flex flex-col justify-center overflow-y-auto pr-1">
            <motion.div 
              layout
              className="grid grid-cols-2 gap-3"
            >
              <AnimatePresence mode="popLayout">
                {currentData.map((item, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      onClick={() => {
                        setActiveIndex(idx);
                        playPluck(261.63 + idx * 30);
                      }}
                      className={`relative p-3.5 rounded-2xl border text-left transition-all duration-500 flex flex-col justify-between overflow-hidden h-24
                        ${isActive 
                          ? styleMode === 'artistic'
                            ? 'bg-[#FAF8F5] border-[#2c2a25] text-[#2c2a25] shadow-md scale-105 z-10'
                            : 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] scale-105 z-10'
                          : styleMode === 'artistic'
                            ? 'bg-[#fcfbfa]/40 border-[#2c2a25]/10 text-[#4a463d] hover:bg-[#FAF8F5]/80 hover:border-[#2c2a25]/30'
                            : 'bg-[#151c2d] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                    >
                      {/* Active Background ripples */}
                      {isActive && (
                        <motion.div 
                          className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center"
                          initial={{ scale: 0.5 }}
                          animate={{ scale: [1, 2], opacity: [0.15, 0] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                        >
                          <div className={`w-full h-full rounded-full ${styleMode === 'artistic' ? 'bg-[#2c2a25]' : 'bg-cyan-400'}`} />
                        </motion.div>
                      )}

                      <div className="flex items-center justify-between w-full">
                        <div className={`p-2 rounded-xl transition-colors duration-500
                          ${isActive 
                            ? styleMode === 'artistic' ? 'bg-[#2c2a25] text-white' : 'bg-cyan-500/20 text-cyan-400'
                            : styleMode === 'artistic' ? 'bg-[#2c2a25]/5 text-[#6e685c]' : 'bg-slate-800 text-slate-500'
                          }`}>
                          {item.icon}
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-medium tracking-wider
                          ${isActive
                            ? 'bg-[#845e2c]/10 text-[#845e2c]'
                            : 'bg-[#2c2a25]/5 text-[#6e685c]/80'
                          }`}
                        >
                          {item.stats.tag}
                        </span>
                      </div>

                      <div className="mt-2">
                        <span className={`text-xs font-bold block tracking-wider ${styleMode === 'artistic' ? 'font-serif-sc' : ''}`}>
                          {item.name}
                        </span>
                        <span className="text-[8.5px] font-mono opacity-50 block uppercase tracking-tight truncate">
                          {item.eng}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right: Immersive Zen Scroll Detail (7 Columns) */}
          <div className="col-span-1 md:col-span-7 flex flex-col justify-between overflow-hidden">
            <div className={`flex-1 rounded-2xl border p-5 md:p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-1000 min-h-[220px] shadow-inner
              ${styleMode === 'artistic'
                ? 'bg-[#fcfbfa]/80 border-[#2c2a25]/10'
                : 'bg-[#0e1422] border-slate-800'
              }`}
            >
              {/* Visual background accents */}
              {styleMode === 'geometric' && (
                <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/5 rounded-bl-full border-b border-l border-cyan-500/20" />
              )}
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${activeIndex}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col justify-between h-full space-y-4"
                >
                  <div>
                    {/* Topic Pill */}
                    <div className="flex items-center justify-between mb-3.5">
                      <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-wider border font-semibold
                        ${styleMode === 'artistic' 
                          ? 'bg-[#2c2a25]/5 text-[#845e2c] border-[#2c2a25]/10' 
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${styleMode === 'artistic' ? 'bg-[#845e2c] animate-pulse' : 'bg-cyan-400 animate-pulse'}`} />
                        <span>2026 前沿情报 (Latest Intelligence)</span>
                      </div>
                      
                      {/* Compass Tag */}
                      <span className="text-[9px] font-mono text-[#6e685c] flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-[#845e2c]" />
                        <span>智网连接点已激活</span>
                      </span>
                    </div>
                    
                    <h3 className={`text-xl md:text-2xl font-bold mb-3 tracking-wider ${styleMode === 'artistic' ? 'font-serif-sc text-[#2c2a25]' : 'text-cyan-300 font-sans'}`}>
                      {selectedItem.name}
                    </h3>
                    
                    {/* Deep text quotes for intelligence */}
                    <p className={`text-xs md:text-sm leading-relaxed ${styleMode === 'artistic' ? 'text-[#4a463d] font-medium font-serif-sc border-l-2 border-[#845e2c]/30 pl-3' : 'text-slate-300 font-mono border-l border-cyan-500/30 pl-3'}`}>
                      {selectedItem.desc}
                    </p>
                  </div>

                  {/* Real-Time Interactive Metrical Gauges */}
                  <div className="pt-4 border-t border-[#2c2a25]/10 grid grid-cols-2 gap-4">
                    {/* Left Stat Gauge */}
                    <div className="flex items-center space-x-3.5">
                      {/* SVG Mini Radial Progress Ring */}
                      <div className="relative w-10 h-10 shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="20" cy="20" r="16" fill="transparent" stroke={styleMode === 'artistic' ? '#2c2a25/5' : '#1e293b'} strokeWidth="3" />
                          <motion.circle 
                            cx="20" 
                            cy="20" 
                            r="16" 
                            fill="transparent" 
                            stroke={styleMode === 'artistic' ? '#845e2c' : '#22d3ee'} 
                            strokeWidth="3"
                            strokeDasharray="100"
                            initial={{ strokeDashoffset: 100 }}
                            animate={{ strokeDashoffset: selectedItem.stats.innovation.includes('%') ? 100 - parseFloat(selectedItem.stats.innovation) : 12 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-bold">
                          创
                        </span>
                      </div>
                      <div>
                        <span className={`text-[8.5px] uppercase font-mono block ${styleMode === 'artistic' ? 'text-[#6e685c]' : 'text-slate-500'}`}>创新指数</span>
                        <span className={`text-sm font-bold font-mono ${styleMode === 'artistic' ? 'text-[#845e2c]' : 'text-cyan-400'}`}>
                          {selectedItem.stats.innovation}
                        </span>
                      </div>
                    </div>

                    {/* Right Stat Gauge */}
                    <div className="flex items-center space-x-3.5">
                      {/* SVG Mini Radial Progress Ring */}
                      <div className="relative w-10 h-10 shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="20" cy="20" r="16" fill="transparent" stroke={styleMode === 'artistic' ? '#2c2a25/5' : '#1e293b'} strokeWidth="3" />
                          <motion.circle 
                            cx="20" 
                            cy="20" 
                            r="16" 
                            fill="transparent" 
                            stroke={styleMode === 'artistic' ? '#2c2a25' : '#818cf8'} 
                            strokeWidth="3"
                            strokeDasharray="100"
                            initial={{ strokeDashoffset: 100 }}
                            animate={{ strokeDashoffset: 25 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-bold">
                          才
                        </span>
                      </div>
                      <div>
                        <span className={`text-[8.5px] uppercase font-mono block ${styleMode === 'artistic' ? 'text-[#6e685c]' : 'text-slate-500'}`}>学科/人才密度</span>
                        <span className={`text-sm font-bold font-mono ${styleMode === 'artistic' ? 'text-[#2c2a25]' : 'text-indigo-400'}`}>
                          {selectedItem.stats.density}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
