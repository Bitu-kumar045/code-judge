import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Terminal, 
  Server, 
  Cpu, 
  Layers, 
  Code2, 
  Palette, 
  Database, 
  ShieldCheck, 
  Scale,
  Video,
  Globe,
  Award,
  Check
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { getScopedItem, setScopedItem } from '../utils/userStorage';

const LEARNING_RESOURCES = [
  {
    id: 'docker',
    category: 'DevOps & Sandboxing',
    title: 'Docker & Container Security',
    icon: Terminal,
    color: 'from-blue-500 to-cyan-500',
    description: 'Master containerization, rootless execution, memory cgroups, network sandboxing, and security isolation for untrusted code execution.',
    items: [
      {
        id: 'docker-docs',
        name: 'Docker Official Get Started Guide',
        url: 'https://docs.docker.com/get-started/',
        type: 'Documentation',
        author: 'Docker Inc.',
        description: 'The definitive handbook covering image building, container lifecycles, volume mounts, tmpfs, and multi-stage Dockerfiles.'
      },
      {
        id: 'docker-nana',
        name: 'TechWorld with Nana — Docker Tutorial',
        url: 'https://www.youtube.com/@TechWorldwithNana',
        type: 'Video Series',
        author: 'Nana Janashia',
        description: 'World-class visual deep dive into containers vs VMs, Docker networking, container resource limits, and Docker Compose.'
      }
    ],
    takeaway: 'Key takeaway: Never run user code with host networking or root access. Always enforce `--network none`, `--memory 256m`, and `--pids-limit 64`.'
  },
  {
    id: 'springboot',
    category: 'Backend Architecture',
    title: 'Spring Boot & Java Enterprise',
    icon: Server,
    color: 'from-emerald-500 to-teal-500',
    description: 'Learn production-grade enterprise Java, RESTful API architecture, Spring Security JWT authentication, and Spring Data JPA.',
    items: [
      {
        id: 'spring-baeldung',
        name: 'Baeldung Spring Boot Tutorials',
        url: 'https://www.baeldung.com/spring-boot',
        type: 'Articles & Guides',
        author: 'Eugen Paraschiv & Team',
        description: 'The gold standard reference for Spring Boot: Security filters, JWT authentication, transactional database joins, and JPA entity relationships.'
      },
      {
        id: 'spring-amigoscode',
        name: 'Amigoscode YouTube Channel',
        url: 'https://www.youtube.com/@amigoscode',
        type: 'Video Tutorials',
        author: 'Nelson Djalo',
        description: 'Practical, end-to-end full-stack Spring Boot tutorials with PostgreSQL, testing with Mockito, Docker integration, and clean code principles.'
      }
    ],
    takeaway: 'Key takeaway: Structure your backend into clean layers: Controller -> Service -> Repository -> Entity. Never expose secret test cases via public endpoints.'
  },
  {
    id: 'react',
    category: 'Frontend Engineering',
    title: 'React & Modern Web UI',
    icon: Code2,
    color: 'from-cyan-400 to-blue-500',
    description: 'Master functional React, declarative state, custom hooks, component composition, and blazing-fast Vite bundler workflows.',
    items: [
      {
        id: 'react-docs',
        name: 'React Official Documentation (react.dev)',
        url: 'https://react.dev/',
        type: 'Official Documentation',
        author: 'React Core Team',
        description: 'The completely redesigned modern React documentation with interactive code challenges and deep explanations of hooks and effects.'
      },
      {
        id: 'react-scrimba',
        name: 'Scrimba Interactive React Course',
        url: 'https://scrimba.com/learn-react-c0e',
        type: 'Interactive Coding',
        author: 'Bob Ziroll',
        description: 'Learn React by pausing the screencast video and editing the code live inside the browser. Best interactive muscle memory builder.'
      }
    ],
    takeaway: 'Key takeaway: Keep state as close as possible to where it is used. Use Monaco Editor for code input and TanStack Query for caching asynchronous data.'
  },
  {
    id: 'tailwind-shadcn',
    category: 'UI Design Systems',
    title: 'Tailwind CSS & shadcn/ui',
    icon: Palette,
    color: 'from-indigo-400 to-purple-500',
    description: 'Craft slick, dark-themed, Linear and Vercel-inspired user interfaces using utility-first classes and accessible Radix UI primitives.',
    items: [
      {
        id: 'tailwind-docs',
        name: 'Tailwind CSS Documentation',
        url: 'https://tailwindcss.com/',
        type: 'Design System',
        author: 'Adam Wathan & Tailwind Labs',
        description: 'Explore responsive utilities, dark mode variants, arbitrary values, and design token customization in tailwind.config.js.'
      },
      {
        id: 'shadcn-ui',
        name: 'shadcn/ui Component Catalog',
        url: 'https://ui.shadcn.com/',
        type: 'Component Library',
        author: 'shadcn',
        description: 'Beautifully designed, accessible components that you copy and paste into your apps. Accessible, customizable, and open source.'
      }
    ],
    takeaway: 'Key takeaway: Pair dark mode `#0B0F19` with card borders `#1F2937` and subtle glow effects to make developers say "wow" the moment they open your site.'
  },
  {
    id: 'system-design',
    category: 'System Architecture',
    title: 'System Design Basics & Scalability',
    icon: Layers,
    color: 'from-purple-500 to-pink-500',
    description: 'Understand distributed architectures, message queues, rate-limiting, database sharding, and high-concurrency judge design.',
    items: [
      {
        id: 'roadmap-sh',
        name: 'roadmap.sh / System Design Roadmap',
        url: 'https://roadmap.sh/system-design',
        type: 'Interactive Roadmap',
        author: 'Kamran Ahmed & Community',
        description: 'Step-by-step visual map covering load balancing, caching tiers, asynchronous processing, CAP theorem, and database partitioning.'
      },
      {
        id: 'bytebytego',
        name: 'ByteByteGo by Alex Xu',
        url: 'https://bytebytego.com/',
        type: 'Visual Architecture Books & Channel',
        author: 'Alex Xu',
        description: 'Clear, illustrated explanations of real-world system designs like LeetCode, YouTube, and Redis, with clear capacity estimation.'
      }
    ],
    takeaway: 'Key takeaway: Without a message queue, your server will freeze when 500 students submit code at once. Always decouple API submission from judge workers.'
  },
  {
    id: 'redis',
    category: 'In-Memory Cache & Queues',
    title: 'Redis & Asynchronous Queues',
    icon: Database,
    color: 'from-rose-500 to-amber-500',
    description: 'Learn in-memory data structures, LPUSH/BRPOP worker queues, pub/sub for real-time judge updates, and rate limiting counters.',
    items: [
      {
        id: 'redis-university',
        name: 'Redis University (Free Certifications)',
        url: 'https://university.redis.com/',
        type: 'Free Courses',
        author: 'Redis Inc.',
        description: 'Comprehensive free online training covering Redis data structures, caching patterns, Streams, and building microservices with Redis.'
      }
    ],
    takeaway: 'Key takeaway: Use Redis lists as a FIFO queue (`LPUSH judge:queue` / `BRPOP judge:queue 0`) to dispatch evaluation jobs to background workers in < 1ms.'
  },
  {
    id: 'real-judges',
    category: 'Production Sandboxes',
    title: 'Study Real-World Online Judges',
    icon: Scale,
    color: 'from-amber-400 to-orange-500',
    description: 'Examine how industry-standard open source online execution engines isolate processes, calculate memory, and defend against fork bombs.',
    items: [
      {
        id: 'judge0-github',
        name: 'Judge0 (Open Source Online Judge)',
        url: 'https://github.com/judge0/judge0',
        type: 'Open Source Codebase',
        author: 'Herman Zvonimir Došilović',
        description: 'Robust, production-grade sandbox API used worldwide. Read how Judge0 utilizes GNU isolate to measure CPU cycles, memory, and signals.'
      },
      {
        id: 'piston-github',
        name: 'Piston Execution Engine',
        url: 'https://github.com/engineer-man/piston',
        type: 'Open Source Codebase',
        author: 'Engineer Man Team',
        description: 'High-performance code execution engine supporting 50+ languages. Inspect how it packages runtimes into isolated unprivileged environments.'
      }
    ],
    takeaway: 'Rule of thumb: "Read how they work, but build your own." Building your own judge engine is the single best proof of systems engineering mastery on your resume!'
  }
];

export default function LearningHubPage() {
  const [completedMap, setCompletedMap] = useState(() => {
    try {
      const saved = getScopedItem('codejudge_learning_progress', null);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const toast = useToast();

  const totalItems = LEARNING_RESOURCES.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  const toggleItem = (itemId, itemName) => {
    setCompletedMap((prev) => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      setScopedItem('codejudge_learning_progress', JSON.stringify(next));
      if (next[itemId]) {
        toast.success(`Marked "${itemName}" as completed!`, 'Progress Saved 🎉');
      }
      return next;
    });
  };

  const categories = ['ALL', 'DevOps & Sandboxing', 'Backend Architecture', 'Frontend Engineering', 'UI Design Systems', 'System Architecture', 'In-Memory Cache & Queues', 'Production Sandboxes'];

  const filteredResources = selectedCategory === 'ALL' 
    ? LEARNING_RESOURCES 
    : LEARNING_RESOURCES.filter(r => r.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#0B0F19] text-slate-100 min-h-screen">
      
      {/* Header Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Curated Developer Learning Path</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Best Websites & Resources to <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              Master the Entire Judge Stack
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            The hand-picked list of official documentations, top YouTube channels, and open-source judge engines you need to study. 
            Track your journey and build skills that stand out in technical interviews.
          </p>
        </div>

        {/* Learning Progress Bar Card */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 max-w-xl relative z-10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Your Curriculum Progress</span>
            </span>
            <span className="text-indigo-400 font-bold">{completedCount} / {totalItems} completed ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-[#111827] text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredResources.map((res) => {
          const Icon = res.icon;
          return (
            <div 
              key={res.id}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-5 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl p-0.5 bg-gradient-to-tr ${res.color} shadow-lg shrink-0`}>
                      <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 font-semibold">
                        {res.category}
                      </span>
                      <h3 className="text-xl font-bold text-white tracking-tight">{res.title}</h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {res.description}
                </p>

                {/* Sub-items / links list */}
                <div className="space-y-3 pt-2">
                  {res.items.map((item) => {
                    const isDone = !!completedMap[item.id];
                    return (
                      <div 
                        key={item.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isDone 
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                            : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              onClick={() => toggleItem(item.id, item.name)}
                              className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                                isDone 
                                  ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                                  : 'border-slate-700 hover:border-indigo-400 bg-slate-950'
                              }`}
                              title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                            >
                              {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>

                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <a 
                                  href={item.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="font-semibold text-sm text-white hover:text-indigo-300 transition-colors inline-flex items-center gap-1 group"
                                >
                                  <span className={isDone ? 'line-through text-slate-400' : ''}>{item.name}</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                                </a>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
                                  {item.type}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 leading-normal">
                                {item.description}
                              </p>
                              <div className="text-[11px] text-slate-500 font-mono">
                                Recommended by: {item.author}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Takeaway Note */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-amber-400 text-[11px] uppercase tracking-wider font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Architecture Wisdom</span>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  {res.takeaway}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* Quote Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-blue-900/30 border border-indigo-500/30 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          "Read how real judges work, but always build your own."
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
          Writing your own sandbox watcher, process timeout guards, and test case diff engines is what separates standard developers from elite systems architects.
        </p>
      </div>

    </div>
  );
}

