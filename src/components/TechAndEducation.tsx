import React, { useState } from 'react';
import { Building2, GraduationCap, Server, Database, Globe, Lightbulb } from 'lucide-react';
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
    desc: '2026 最新动态：全息通义大模型（Qwen Holographic）发布，全面赋能杭州智慧城市底层算力。'
  },
  {
    id: 'netease',
    name: '网易伏羲',
    eng: 'NetEase Fuxi',
    icon: <Globe className="w-5 h-5" />,
    desc: '2026 最新动态：在虚拟现实与具身智能引擎上实现突破，首个AI全自动生成3D物理世界引擎在杭落地。'
  },
  {
    id: 'hikvision',
    name: '海康威视',
    eng: 'Hikvision',
    icon: <Database className="w-5 h-5" />,
    desc: '2026 最新动态：推出天穹城市感知生态，实现杭州全市域毫秒级多维数据融合感知系统部署。'
  }
];

const UNIVERSITIES = [
  {
    id: 'zju',
    name: '浙江大学',
    eng: 'Zhejiang University',
    icon: <GraduationCap className="w-5 h-5" />,
    desc: '2026 最新动态：紫金港校区落成国家级强人工智能联合实验室，领跑脑机接口（BCI）第三代非侵入式技术。'
  },
  {
    id: 'westlake',
    name: '西湖大学',
    eng: 'Westlake University',
    icon: <Lightbulb className="w-5 h-5" />,
    desc: '2026 最新动态：云谷校区科研团队在量子计算纠错算法取得颠覆性成果，发布《2026深科技先锋报告》。'
  }
];

const HZ_DRAGONS = [
  {
    id: 'deepseek',
    name: '深度求索',
    eng: 'DeepSeek',
    icon: <Database className="w-5 h-5" />,
    desc: '2026 最新动态：人工智能领军企业，主攻大语言模型研发，代表了中国在新技术领域的顶尖创新力量。'
  },
  {
    id: 'unitree',
    name: '宇树科技',
    eng: 'Unitree',
    icon: <Globe className="w-5 h-5" />,
    desc: '2026 最新动态：领先的机器人公司，专注于四足机器人和人形机器人的研发制造，深度拓展具身智能。'
  },
  {
    id: 'gamescience',
    name: '游戏科学',
    eng: 'Game Science',
    icon: <Server className="w-5 h-5" />,
    desc: '2026 最新动态：顶尖游戏开发商，因打造现象级单机大作《黑神话：悟空》而闻名，持续推动中国数字娱乐出海。'
  },
  {
    id: 'brainco',
    name: '强脑科技',
    eng: 'BrainCo',
    icon: <Lightbulb className="w-5 h-5" />,
    desc: '2026 最新动态：脑机接口领域的独角兽，专注于康复医疗与神经反馈技术，领跑非侵入式脑机接口前沿。'
  },
  {
    id: 'kujiale',
    name: '群核科技',
    eng: 'Kujiale',
    icon: <Building2 className="w-5 h-5" />,
    desc: '2026 最新动态：领先的空间智能与云设计软件平台，提供全屋装修设计解决方案，构建全球领先的3D云设计生态。'
  },
  {
    id: 'deeprobotics',
    name: '云深处科技',
    eng: 'DeepRobotics',
    icon: <Globe className="w-5 h-5" />,
    desc: '2026 最新动态：前沿四足机器人企业，深耕行业级特种机器人的研发，在复杂地形巡检与救援场景应用广泛。'
  }
];

export function TechAndEducation({ styleMode, playPluck }: TechAndEducationProps) {
  const [activeTab, setActiveTab] = useState<'tech' | 'edu' | 'dragons'>('tech');
  const [activeIndex, setActiveIndex] = useState(0);

  const currentData = activeTab === 'tech' ? TECH_COMPANIES : activeTab === 'edu' ? UNIVERSITIES : HZ_DRAGONS;

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-1000 overflow-hidden relative group
      ${styleMode === 'artistic' 
        ? 'bg-[#eae5da]/40 border-transparent text-zinc-900 shadow-[0_4px_30px_rgba(20,83,45,0.02)]' 
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

      <div className="relative z-10 flex flex-col gap-6 w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b pb-3 border-slate-500/20">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-bold tracking-widest ${styleMode === 'artistic' ? 'font-serif-sc text-zinc-900' : 'font-sans text-cyan-400'}`}>
              {styleMode === 'artistic' ? '名企学府' : 'INNOVATION & EDUCATION HUB'}
            </span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => { setActiveTab('tech'); setActiveIndex(0); playPluck(330); }}
              className={`px-3 py-1 text-xs rounded-full border transition-all duration-300
                ${activeTab === 'tech'
                  ? styleMode === 'artistic' ? 'bg-emerald-900/10 border-emerald-900 text-emerald-950 font-bold' : 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                  : styleMode === 'artistic' ? 'border-zinc-300 text-zinc-500' : 'border-slate-700 text-slate-400'
                }`}
            >
              {styleMode === 'artistic' ? '领军科技' : 'TECH GIANTS'}
            </button>
            <button 
              onClick={() => { setActiveTab('edu'); setActiveIndex(0); playPluck(392); }}
              className={`px-3 py-1 text-xs rounded-full border transition-all duration-300
                ${activeTab === 'edu'
                  ? styleMode === 'artistic' ? 'bg-emerald-900/10 border-emerald-900 text-emerald-950 font-bold' : 'bg-indigo-500/20 border-indigo-400 text-indigo-300 font-bold'
                  : styleMode === 'artistic' ? 'border-zinc-300 text-zinc-500' : 'border-slate-700 text-slate-400'
                }`}
            >
              {styleMode === 'artistic' ? '顶尖学府' : 'UNIVERSITIES'}
            </button>
            <button 
              onClick={() => { setActiveTab('dragons'); setActiveIndex(0); playPluck(440); }}
              className={`px-3 py-1 text-xs rounded-full border transition-all duration-300
                ${activeTab === 'dragons'
                  ? styleMode === 'artistic' ? 'bg-emerald-900/10 border-emerald-900 text-emerald-950 font-bold' : 'bg-purple-500/20 border-purple-400 text-purple-300 font-bold'
                  : styleMode === 'artistic' ? 'border-zinc-300 text-zinc-500' : 'border-slate-700 text-slate-400'
                }`}
            >
              {styleMode === 'artistic' ? '杭州六小龙' : 'HZ SIX DRAGONS'}
            </button>
          </div>
        </div>

        {/* List and Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left: Selector List */}
          <div className="flex flex-col space-y-3">
            {currentData.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    playPluck(261.63 + idx * 20);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all duration-300 flex items-center space-x-3
                    ${isActive 
                      ? styleMode === 'artistic'
                        ? 'bg-zinc-900/5 border-emerald-950/40 text-emerald-950 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]'
                        : 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                      : styleMode === 'artistic'
                        ? 'bg-transparent border-emerald-950/10 text-zinc-600 hover:border-emerald-950/30'
                        : 'bg-[#151c2d] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                >
                  <div className={`p-2 rounded-lg shrink-0
                    ${isActive 
                      ? styleMode === 'artistic' ? 'bg-emerald-100 text-emerald-900' : 'bg-cyan-500/20 text-cyan-400'
                      : styleMode === 'artistic' ? 'bg-zinc-100 text-zinc-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                    {item.icon}
                  </div>
                  <div>
                    <span className={`text-sm font-bold block ${styleMode === 'artistic' ? 'font-serif-sc' : ''}`}>
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono opacity-60 block uppercase">
                      {item.eng}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detail View */}
          <div className={`md:col-span-2 rounded-xl border p-6 flex flex-col justify-center relative overflow-hidden transition-all duration-1000 min-h-[220px]
            ${styleMode === 'artistic'
              ? 'bg-[#f8f5f0] border-emerald-950/10'
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider mb-4 border
                  ${styleMode === 'artistic' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${styleMode === 'artistic' ? 'bg-emerald-600 animate-pulse' : 'bg-cyan-400 animate-pulse'}`} />
                  <span>2026 LATEST INTELLIGENCE</span>
                </div>
                
                <h3 className={`text-xl md:text-2xl font-bold mb-2 ${styleMode === 'artistic' ? 'font-serif-sc text-zinc-900' : 'text-cyan-300 font-sans'}`}>
                  {currentData[activeIndex].name}
                </h3>
                
                <p className={`text-sm leading-relaxed ${styleMode === 'artistic' ? 'text-zinc-700' : 'text-slate-300 font-mono'}`}>
                  {currentData[activeIndex].desc}
                </p>

                {/* Simulated Data Points */}
                <div className="mt-6 pt-6 border-t border-slate-500/20 grid grid-cols-2 gap-4">
                  <div>
                    <span className={`text-[10px] uppercase font-mono block mb-1 ${styleMode === 'artistic' ? 'text-zinc-500' : 'text-slate-500'}`}>Innovation Index</span>
                    <span className={`text-lg font-bold font-mono ${styleMode === 'artistic' ? 'text-emerald-800' : 'text-cyan-400'}`}>98.7%</span>
                  </div>
                  <div>
                    <span className={`text-[10px] uppercase font-mono block mb-1 ${styleMode === 'artistic' ? 'text-zinc-500' : 'text-slate-500'}`}>Talent Density</span>
                    <span className={`text-lg font-bold font-mono ${styleMode === 'artistic' ? 'text-emerald-800' : 'text-indigo-400'}`}>TOP 1%</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
