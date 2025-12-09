/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React, { createContext, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Zap, Menu, X, Sun, Moon, ArrowRight, Sparkles, Users, Shield,
  Rocket, Eye, ShieldCheck, Trophy, Briefcase, TrendingUp,
  Brain, UserSearch, FileCheck, ClipboardList, Bot, Code, CheckCircle,
  Github, MessageCircle, Mail, Mail as MailIcon, Lock, GraduationCap, Building2,
  FolderKanban, Clock, DollarSign, Calendar, Tag, ArrowLeft, Plus, Loader2,
  CheckCircle2, AlertCircle, Edit, Eye as EyeIcon, UserPlus, Search, Send,
  LayoutDashboard, Settings, LogOut, Bell, Star, Save, Shield as ShieldIcon,
  Clock as ClockIcon, DollarSign as DollarSignIcon, Award, Target, FileText
} from 'lucide-react';
import './styles/global.css';
import { AuthProvider, useAuth } from './lib/auth-context';
import { projectsApi, estimatorApi, usersApi, ratingsApi, applicationsApi, api, Project, Task, User as UserType, ApiError, RegisterData } from './lib/api';

// ==================== THEME CONTEXT ====================
type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setThemeState('light');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ==================== THEME TOGGLE ====================
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg transition-all duration-300 hover:scale-110 group"
      style={{
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #1e1e2a 0%, #12121a 100%)' 
          : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        border: `1px solid ${theme === 'dark' ? '#2a2a3a' : '#cbd5e1'}`,
      }}
      aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'light' 
              ? 'rotate-0 scale-100 text-accent-amber' 
              : 'rotate-90 scale-0 text-gray-400'
          }`}
        />
        <Moon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 text-accent-blue' 
              : '-rotate-90 scale-0 text-gray-400'
          }`}
        />
      </div>
    </button>
  );
};

// ==================== HEADER ====================
const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'Для студентов', href: '/students' },
  { name: 'Для заказчиков', href: '/customers' },
  { name: 'Как это работает', href: '/how-it-works' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-300"
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--color-border)',
      }}
    >
      <nav className="container-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              WORK<span className="text-accent-green">21</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-green transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <a href="/login" className="text-sm transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
              Войти
            </a>
            <a href="/register" className="btn-primary text-sm">
              Начать
            </a>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="transition-colors py-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <ThemeToggle />
                <a href="/login" className="btn-secondary text-sm flex-1 text-center">
                  Войти
                </a>
                <a href="/register" className="btn-primary text-sm flex-1 text-center">
                  Начать
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

// ==================== HERO ====================
const StatCard = ({ 
  icon, 
  value, 
  label, 
  color = 'green' 
}: { 
  icon: React.ReactNode;
  value: string;
  label: string;
  color?: 'green' | 'blue' | 'violet';
}) => {
  const colorClasses = {
    green: 'text-accent-green bg-accent-green/10 border-accent-green/20',
    blue: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
    violet: 'text-accent-violet bg-accent-violet/10 border-accent-violet/20',
  };

  return (
    <div className="glass-card rounded-2xl p-6 text-center">
      <div className={`inline-flex p-3 rounded-xl mb-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0 gradient-glow" />
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />

      <div className="container-lg mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-work21-card border border-work21-border mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent-amber" />
            <span className="text-sm text-gray-300">Платформа нового поколения</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            <span className="block text-white">Соединяем</span>
            <span className="block gradient-text">таланты и бизнес</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-100">
            <span className="text-white font-medium">WORK21</span> — платформа, где студенты Школы 21 
            получают реальный коммерческий опыт, а компании находят молодые таланты
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up animate-delay-200">
            <a href="/register?role=student" className="btn-primary inline-flex items-center justify-center gap-2 text-lg">
              Я студент
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/register?role=customer" className="btn-outline inline-flex items-center justify-center gap-2 text-lg">
              Я заказчик
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-slide-up animate-delay-300">
            <StatCard icon={<Users className="w-6 h-6" />} value="9,000+" label="Студентов в сети" />
            <StatCard icon={<Sparkles className="w-6 h-6" />} value="AI" label="Автоматизация" color="blue" />
            <StatCard icon={<Shield className="w-6 h-6" />} value="100%" label="Безопасность сделок" color="violet" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-work21-dark to-transparent" />
    </section>
  );
};

// ==================== FEATURES ====================
const features = {
  students: [
    {
      icon: Briefcase,
      title: 'Реальный опыт',
      description: 'Не симуляции, а настоящие коммерческие проекты от реальных заказчиков',
    },
    {
      icon: TrendingUp,
      title: 'Карьерный рост',
      description: 'Каждый проект — строчка в резюме и очки к вашему рейтингу',
    },
    {
      icon: Trophy,
      title: 'Денежные бонусы',
      description: 'Топ-студенты ежемесячно получают премии из фонда платформы',
    },
  ],
  customers: [
    {
      icon: Rocket,
      title: 'Быстрый старт',
      description: 'От идеи до первого этапа разработки за считанные дни',
    },
    {
      icon: Eye,
      title: 'Прозрачность',
      description: 'AI помогает честно оценить объём работ и бюджет проекта',
    },
    {
      icon: ShieldCheck,
      title: 'Безопасность',
      description: 'Платформа гарантирует качество результата и защиту сделки',
    },
  ],
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color = 'green',
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color?: 'green' | 'blue';
}) => {
  const colorClasses = {
    green: 'text-accent-green bg-accent-green/10',
    blue: 'text-accent-blue bg-accent-blue/10',
  };

  return (
    <div className="glass-card rounded-xl p-5 flex gap-4 hover:border-work21-border/80 transition-colors group">
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center group-hover:scale-105 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section className="section relative">
      <div className="container-lg mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-green/10 text-accent-green text-sm font-medium mb-4">
            Преимущества
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Выигрывают все
          </h2>
          <p className="text-lg text-gray-400">
            WORK21 создаёт win-win ситуацию для студентов и заказчиков
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent-green/10 flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Для студентов</h3>
                <p className="text-sm text-gray-400">Получите опыт и заработок</p>
              </div>
            </div>
            <div className="space-y-4">
              {features.students.map((feature, index) => (
                <FeatureCard key={index} {...feature} color="green" />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center">
                <span className="text-2xl">💼</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Для заказчиков</h3>
                <p className="text-sm text-gray-400">Получите результат быстро</p>
              </div>
            </div>
            <div className="space-y-4">
              {features.customers.map((feature, index) => (
                <FeatureCard key={index} {...feature} color="blue" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== AI AGENTS ====================
const agents = [
  {
    id: 'task-analyst',
    name: 'Task Analyst',
    title: 'Агент-аналитик',
    description: 'Превращает идею заказчика в структурированное техническое задание. Анализирует требования, дробит на подзадачи, оценивает сроки и риски.',
    icon: Brain,
    color: 'green',
    features: ['Анализ требований', 'Декомпозиция задач', 'Оценка сложности', 'Планирование сроков'],
  },
  {
    id: 'talent-matcher',
    name: 'Talent Matcher',
    title: 'HR-агент',
    description: 'Находит идеальных исполнителей. Анализирует навыки, рейтинг и портфолио студентов, подбирая команду под конкретный проект.',
    icon: UserSearch,
    color: 'blue',
    features: ['Поиск по навыкам', 'Анализ рейтинга', 'Проверка портфолио', 'Ранжирование'],
  },
  {
    id: 'legal-assistant',
    name: 'Legal Assistant',
    title: 'Агент-юрист',
    description: 'Обеспечивает безопасность сделки. Формирует типовой договор, фиксирует условия, защищает интересы обеих сторон.',
    icon: FileCheck,
    color: 'violet',
    features: ['Генерация договора', 'Условия и сроки', 'Защита сторон', 'Обработка платежей'],
  },
];

const colorStyles = {
  green: {
    bg: 'bg-accent-green/10',
    border: 'border-accent-green/30',
    text: 'text-accent-green',
  },
  blue: {
    bg: 'bg-accent-blue/10',
    border: 'border-accent-blue/30',
    text: 'text-accent-blue',
  },
  violet: {
    bg: 'bg-accent-violet/10',
    border: 'border-accent-violet/30',
    text: 'text-accent-violet',
  },
};

const AIAgents = () => {
  return (
    <section className="section bg-work21-darker relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      <div className="container-lg mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-4">
            Искусственный интеллект
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            AI — не помощник, а{' '}
            <span className="gradient-text">архитектор проектов</span>
          </h2>
          <p className="text-lg text-gray-400">
            Три AI-агента работают синхронно, превращая идею в готовый проект за дни, а не месяцы
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {agents.map((agent) => {
            const styles = colorStyles[agent.color as keyof typeof colorStyles];
            const Icon = agent.icon;
            
            return (
              <div
                key={agent.id}
                className={`glass-card rounded-2xl p-6 lg:p-8 border ${styles.border} hover:shadow-lg transition-all duration-300 group`}
              >
                <div className={`inline-flex p-4 rounded-2xl ${styles.bg} ${styles.text} mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>

                <div className="mb-4">
                  <span className={`text-sm font-mono ${styles.text}`}>{agent.name}</span>
                  <h3 className="text-xl font-bold text-white mt-1">{agent.title}</h3>
                </div>

                <p className="text-gray-400 mb-6 leading-relaxed">
                  {agent.description}
                </p>

                <ul className="space-y-2">
                  {agent.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                      <ArrowRight className={`w-4 h-4 ${styles.text}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            За считанные минуты система полностью готова к работе
          </p>
          <div className="inline-flex items-center gap-2 text-accent-green font-medium">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-green"></span>
            </span>
            Агенты активны и готовы к работе
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== HOW IT WORKS ====================
const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Заказчик создаёт задачу',
    description: 'Описывает потребности: что нужно разработать, какой результат ожидает, какой бюджет готов выделить.',
    color: 'green',
  },
  {
    number: '02',
    icon: Bot,
    title: 'AI-агенты анализируют',
    description: 'Task Analyst формирует ТЗ, Talent Matcher ищет исполнителей, Legal Assistant готовит договор.',
    color: 'blue',
  },
  {
    number: '03',
    icon: Users,
    title: 'Студенты подают заявки',
    description: 'Видят реальный проект, реальную оплату и возможность добавить работу в портфолио.',
    color: 'violet',
  },
  {
    number: '04',
    icon: Code,
    title: 'Работа над проектом',
    description: 'Отобранные участники выполняют этапы согласно ТЗ, получают обратную связь.',
    color: 'amber',
  },
  {
    number: '05',
    icon: CheckCircle,
    title: 'Готовый продукт',
    description: 'В кратчайшие сроки вы получаете результат. Оплата, рейтинг, договор — всё закрывается автоматически.',
    color: 'green',
  },
];

const stepColorStyles = {
  green: { bg: 'bg-accent-green/10', text: 'text-accent-green', border: 'border-accent-green/30' },
  blue: { bg: 'bg-accent-blue/10', text: 'text-accent-blue', border: 'border-accent-blue/30' },
  violet: { bg: 'bg-accent-violet/10', text: 'text-accent-violet', border: 'border-accent-violet/30' },
  amber: { bg: 'bg-accent-amber/10', text: 'text-accent-amber', border: 'border-accent-amber/30' },
};

const HowItWorks = () => {
  return (
    <section className="section bg-work21-darker relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="container-lg mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-violet/10 text-accent-violet text-sm font-medium mb-4">
            Процесс
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Как это работает
          </h2>
          <p className="text-lg text-gray-400">
            От идеи до готового продукта за 5 простых шагов
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => {
            const styles = stepColorStyles[step.color as keyof typeof stepColorStyles];
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="glass-card rounded-2xl p-6 border transition-shadow hover:shadow-lg"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${styles.bg}`}>
                    <Icon className={`w-6 h-6 ${styles.text}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-sm font-mono ${styles.text}`}>Шаг {step.number}</span>
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ==================== CTA ====================
const CTA = () => {
  return (
    <section className="section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-work21-dark via-work21-darker to-work21-dark" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-green/10 rounded-full blur-3xl" />

      <div className="container-lg mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex p-4 rounded-2xl bg-accent-green/10 text-accent-green mb-8 animate-pulse-glow">
            <Zap className="w-10 h-10" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Готовы начать?
          </h2>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Присоединяйтесь к платформе, которая соединяет образование с реальным рынком труда. 
            Начните свой путь уже сегодня.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register?role=student"
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
            >
              Зарегистрироваться как студент
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/register?role=customer"
              className="btn-outline inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
            >
              Создать проект как заказчик
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-green" />
              Бесплатная регистрация
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-blue" />
              Безопасные платежи
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-violet" />
              Поддержка 24/7
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== FOOTER ====================
const footerLinks = {
  platform: [
    { name: 'Для студентов', href: '/students' },
    { name: 'Для заказчиков', href: '/customers' },
    { name: 'Как это работает', href: '/how-it-works' },
    { name: 'Job Connect', href: '/jobs' },
  ],
  support: [
    { name: 'Документация', href: '/docs' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Контакты', href: '/contacts' },
    { name: 'Поддержка', href: '/support' },
  ],
  legal: [
    { name: 'Условия использования', href: '/terms' },
    { name: 'Политика конфиденциальности', href: '/privacy' },
    { name: 'Публичная оферта', href: '/offer' },
  ],
};

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-lg bg-work21-card border border-work21-border flex items-center justify-center text-gray-400 hover:text-white hover:border-accent-green/50 transition-all"
    >
      {icon}
    </a>
  );
};

const Footer = () => {
  return (
    <footer className="bg-work21-darker border-t border-work21-border">
      <div className="container-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                WORK<span className="text-accent-green">21</span>
              </span>
            </a>
            <p className="text-gray-400 mb-6 max-w-sm">
              Платформа, соединяющая студентов Школы 21 с реальными заказчиками. 
              Получайте опыт, создавайте портфолио, зарабатывайте.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink href="https://github.com" icon={<Github className="w-5 h-5" />} />
              <SocialLink href="https://t.me" icon={<MessageCircle className="w-5 h-5" />} />
              <SocialLink href="mailto:hello@work21.ru" icon={<Mail className="w-5 h-5" />} />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Платформа</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Поддержка</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Правовая информация</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-work21-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} WORK21. Все права защищены.
          </p>
          <p className="text-sm text-gray-500">
            Сделано с 💚 для{' '}
            <span className="text-accent-green">Школы 21</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

// ==================== LOGIN PAGE ====================
const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при входе');
      }
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex">
        <div className="hidden lg:flex flex-1 bg-work21-card border-r border-work21-border items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />
          <div className="max-w-md text-center relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center mx-auto mb-8">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">С возвращением!</h2>
            <p className="text-gray-400 mb-8">
              Войдите в свой аккаунт, чтобы продолжить работу над проектами или найти новых исполнителей.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-work21-dark/50 border border-work21-border">
                <div className="text-2xl font-bold text-accent-green">9000+</div>
                <div className="text-sm text-gray-400">Студентов</div>
              </div>
              <div className="p-4 rounded-xl bg-work21-dark/50 border border-work21-border">
                <div className="text-2xl font-bold text-accent-blue">500+</div>
                <div className="text-sm text-gray-400">Проектов</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <a href="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">WORK<span className="text-accent-green">21</span></span>
            </a>
            <h1 className="text-3xl font-bold text-white mb-2">Вход в аккаунт</h1>
            <p className="text-gray-400 mb-8">Введите свои данные для входа</p>
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-work21-card border border-work21-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">Пароль</label>
                  <a href="/forgot-password" className="text-sm text-accent-green hover:underline">Забыли пароль?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-work21-card border border-work21-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                    placeholder="Ваш пароль"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-accent-green hover:bg-accent-green-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Войти <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-work21-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-work21-dark text-gray-500">или</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <a href="/register?role=student" className="py-3 px-4 bg-work21-card hover:bg-work21-border border border-work21-border rounded-lg text-center text-sm text-gray-300 hover:text-white transition-colors">
                Я студент
              </a>
              <a href="/register?role=customer" className="py-3 px-4 bg-work21-card hover:bg-work21-border border border-work21-border rounded-lg text-center text-sm text-gray-300 hover:text-white transition-colors">
                Я заказчик
              </a>
            </div>
            <p className="mt-8 text-center text-gray-400">
              Нет аккаунта? <a href="/register" className="text-accent-green hover:underline">Зарегистрироваться</a>
            </p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

// ==================== REGISTER PAGE ====================
const RegisterPage = ({ role: initialRole }: { role: 'student' | 'customer' }) => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: initialRole,
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRoleChange = (role: 'student' | 'customer') => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (formData.password.length < 8) {
      setError('Пароль должен быть не менее 8 символов');
      return;
    }
    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при регистрации');
      }
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <a href="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">WORK<span className="text-accent-green">21</span></span>
            </a>
            <h1 className="text-3xl font-bold text-white mb-2">Создать аккаунт</h1>
            <p className="text-gray-400 mb-8">Присоединяйтесь к платформе WORK21</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.role === 'student'
                    ? 'border-accent-green bg-accent-green/10'
                    : 'border-work21-border hover:border-gray-600'
                }`}
              >
                <GraduationCap className={`w-8 h-8 mx-auto mb-2 ${
                  formData.role === 'student' ? 'text-accent-green' : 'text-gray-400'
                }`} />
                <div className={`font-medium ${
                  formData.role === 'student' ? 'text-white' : 'text-gray-400'
                }`}>Студент</div>
                <div className="text-xs text-gray-500 mt-1">Ищу проекты</div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('customer')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.role === 'customer'
                    ? 'border-accent-blue bg-accent-blue/10'
                    : 'border-work21-border hover:border-gray-600'
                }`}
              >
                <Building2 className={`w-8 h-8 mx-auto mb-2 ${
                  formData.role === 'customer' ? 'text-accent-blue' : 'text-gray-400'
                }`} />
                <div className={`font-medium ${
                  formData.role === 'customer' ? 'text-white' : 'text-gray-400'
                }`}>Заказчик</div>
                <div className="text-xs text-gray-500 mt-1">Ищу исполнителей</div>
              </button>
            </div>
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-work21-card border border-work21-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                      placeholder="Иван"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Фамилия</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-work21-card border border-work21-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                    placeholder="Петров"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-work21-card border border-work21-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-4 py-3 bg-work21-card border border-work21-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                    placeholder="Минимум 8 символов"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Подтвердите пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-work21-card border border-work21-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                    placeholder="Повторите пароль"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-accent-green hover:bg-accent-green-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Создать аккаунт <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
            <p className="mt-8 text-center text-gray-400">
              Уже есть аккаунт? <a href="/login" className="text-accent-green hover:underline">Войти</a>
            </p>
          </div>
        </div>
        <div className="hidden lg:flex flex-1 bg-work21-card border-l border-work21-border items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center mx-auto mb-8">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {formData.role === 'student' 
                ? 'Начните зарабатывать на своих навыках'
                : 'Найдите талантливых разработчиков'
              }
            </h2>
            <p className="text-gray-400">
              {formData.role === 'student'
                ? 'Получайте реальный опыт, работая над коммерческими проектами. Стройте портфолио и карьеру.'
                : 'Более 9000 студентов Школы 21 готовы взяться за ваш проект. Быстро, качественно, безопасно.'
              }
            </p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

// ==================== STUDENTS PAGE ====================
const StudentsPage = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-work21-dark text-white">
        <Header />
        <main className="pt-16">
          <section className="section relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-0 gradient-glow" />
            <div className="container-lg mx-auto relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent-green/10 text-accent-green text-sm font-medium mb-6">
                  Для студентов Школы 21
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                  Превратите навыки в{' '}
                  <span className="gradient-text">реальный опыт</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                  WORK21 — это мост между обучением и карьерой. Выполняйте реальные проекты, 
                  зарабатывайте деньги и стройте портфолио ещё до окончания Школы 21.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/register?role=student" className="btn-primary inline-flex items-center justify-center gap-2 text-lg">
                    Начать зарабатывать
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a href="/how-it-works" className="btn-outline inline-flex items-center justify-center gap-2 text-lg">
                    Как это работает
                  </a>
                </div>
              </div>
            </div>
          </section>
          <section className="section bg-work21-darker">
            <div className="container-lg mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Что вы получаете</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Всё, что нужно для профессионального роста и финансовой независимости
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Briefcase, title: 'Реальные проекты', description: 'Работайте над настоящими коммерческими задачами от реальных заказчиков, а не над учебными симуляциями.' },
                  { icon: TrendingUp, title: 'Рост портфолио', description: 'Каждый завершённый проект — это новая строчка в резюме и доказательство ваших навыков.' },
                  { icon: DollarSignIcon, title: 'Честная оплата', description: 'Получайте деньги за свою работу. Платформа гарантирует безопасность платежей.' },
                  { icon: Trophy, title: 'Рейтинговая система', description: 'Зарабатывайте очки репутации, поднимайтесь в рейтинге и получайте доступ к лучшим проектам.' },
                  { icon: Award, title: 'Ежемесячные бонусы', description: 'Топ-студенты получают денежные премии из специального фонда платформы.' },
                  { icon: Target, title: 'Job Connect', description: 'Работодатели видят ваш профиль и могут пригласить на постоянную работу.' },
                ].map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="glass-card rounded-2xl p-6 hover:border-accent-green/30 transition-all group">
                      <div className="w-14 h-14 rounded-xl bg-accent-green/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-accent-green" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

// ==================== CUSTOMERS PAGE ====================
const CustomersPage = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-work21-dark text-white">
        <Header />
        <main className="pt-16">
          <section className="section relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-0 gradient-glow" />
            <div className="container-lg mx-auto relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-6">
                  Для бизнеса и госструктур
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                  Найдите талантливых{' '}
                  <span className="gradient-text">разработчиков</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                  WORK21 открывает доступ к пулу из 9000+ студентов Школы 21 — 
                  молодых IT-специалистов с актуальными навыками и высокой мотивацией.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/register?role=customer" className="btn-primary inline-flex items-center justify-center gap-2 text-lg">
                    Создать проект
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a href="/how-it-works" className="btn-outline inline-flex items-center justify-center gap-2 text-lg">
                    Узнать больше
                  </a>
                </div>
              </div>
            </div>
          </section>
          <section className="section bg-work21-darker">
            <div className="container-lg mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Преимущества платформы</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Всё для быстрой, качественной и безопасной разработки
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Rocket, title: 'Быстрый старт', description: 'От идеи до первого этапа разработки за считанные дни, а не месяцы.' },
                  { icon: Eye, title: 'Прозрачная стоимость', description: 'AI помогает честно оценить объём работ и бюджет. Никаких скрытых платежей.' },
                  { icon: ShieldCheck, title: 'Безопасность сделки', description: 'Платформа выступает гарантом. Деньги переводятся исполнителю только после приёмки.' },
                  { icon: Bot, title: 'AI-ассистенты', description: 'Три AI-агента автоматически формируют ТЗ, подбирают команду и готовят договор.' },
                  { icon: Users, title: 'Проверенные исполнители', description: 'Студенты Школы 21 — это талантливые разработчики с актуальными навыками.' },
                  { icon: DollarSignIcon, title: 'Доступные цены', description: 'Качественная разработка по конкурентным ценам. Сниженные комиссии.' },
                ].map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="glass-card rounded-2xl p-6 hover:border-accent-blue/30 transition-all group">
                      <div className="w-14 h-14 rounded-xl bg-accent-blue/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-accent-blue" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

// ==================== HOW IT WORKS PAGE ====================
const HowItWorksPage = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-work21-dark text-white">
        <Header />
        <main className="pt-16">
          <section className="section relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-0 gradient-glow" />
            <div className="container-lg mx-auto relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent-violet/10 text-accent-violet text-sm font-medium mb-6">
                  Процесс работы
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                  Как работает{' '}
                  <span className="gradient-text">WORK21</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
                  Простой и прозрачный процесс от создания задачи до получения готового продукта
                </p>
              </div>
            </div>
          </section>
          <HowItWorks />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

// ==================== DASHBOARD PAGES ====================
const ProjectDetailPage = ({ projectId }: { projectId: number }) => {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !projectId) return;
    const loadProject = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await projectsApi.getById(projectId);
        setProject(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Ошибка при загрузке проекта');
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadProject();
  }, [user, projectId]);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent-green animate-spin" />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <a href="/dashboard/projects" className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <div>
            <h1 className="text-2xl font-bold text-white">Проект</h1>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const parseTechStack = (techStack: string | string[] | undefined): string[] => {
    if (!techStack) return [];
    try {
      if (typeof techStack === 'string') {
        if (techStack.startsWith('[')) {
          return JSON.parse(techStack);
        }
        return [];
      }
      if (Array.isArray(techStack)) {
        return techStack;
      }
      return [];
    } catch {
      return [];
    }
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    draft: { label: 'Черновик', color: 'bg-gray-500/20 text-gray-400' },
    open: { label: 'Открыт', color: 'bg-accent-green/20 text-accent-green' },
    in_progress: { label: 'В работе', color: 'bg-accent-blue/20 text-accent-blue' },
    review: { label: 'На проверке', color: 'bg-accent-amber/20 text-accent-amber' },
    completed: { label: 'Завершен', color: 'bg-accent-green/20 text-accent-green' },
    cancelled: { label: 'Отменен', color: 'bg-red-500/20 text-red-400' },
  };

  const techStack = parseTechStack(project.tech_stack);
  const status = statusLabels[project.status] || statusLabels.draft;
  const isOwner = user.role === 'customer' && project.customer_id === user.id;
  const isAssignee = user.role === 'student' && project.assignee_id === user.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/dashboard/projects" className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{project.title}</h1>
              <span className={`px-3 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              ID: {project.id} • Создан: {new Date(project.created_at).toLocaleDateString('ru-RU')}
              {project.assignee && (
                <> • Исполнитель: {project.assignee.first_name} {project.assignee.last_name}</>
              )}
            </p>
          </div>
        </div>
        {user.role === 'student' && project.status === 'open' && !isAssignee && (
          <a href={`/dashboard/projects/${project.id}/apply`} className="btn-primary flex items-center gap-2">
            <Users className="w-4 h-4" />
            Подать заявку
          </a>
        )}
      </div>

      {error && (
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="glass-card rounded-2xl border border-work21-border p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent-blue" />
            Основная информация
          </h2>
          <p className="text-sm text-gray-400">Описание проекта и требования</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Описание проекта</label>
          <div className="px-4 py-3 rounded-lg bg-work21-dark/50 border border-work21-border text-gray-300 whitespace-pre-wrap">
            {project.description}
          </div>
        </div>
        {project.requirements && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Требования</label>
            <div className="px-4 py-3 rounded-lg bg-work21-dark/50 border border-work21-border text-gray-300 whitespace-pre-wrap">
              {project.requirements}
            </div>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl border border-work21-border p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-accent-violet" />
            Детали проекта
          </h2>
          <p className="text-sm text-gray-400">Бюджет, сроки и технологии</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <DollarSignIcon className="w-4 h-4 text-accent-green" />
              Бюджет
            </label>
            <div className="px-4 py-3 rounded-lg bg-work21-dark/50 border border-work21-border text-white font-semibold">
              {project.budget.toLocaleString('ru-RU')} ₽
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-blue" />
              Срок выполнения
            </label>
            <div className="px-4 py-3 rounded-lg bg-work21-dark/50 border border-work21-border text-white">
              {project.deadline ? new Date(project.deadline).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) : 'Не указано'}
            </div>
          </div>
        </div>
        {project.llm_estimation && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-accent-violet" />
              Оценка времени выполнения от LLM
            </label>
            <div className="px-4 py-4 rounded-lg bg-accent-violet/10 border border-accent-violet/30 text-gray-300 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
              {project.llm_estimation}
            </div>
          </div>
        )}
        {techStack.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-accent-blue" />
              Технологии
            </label>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {project.tasks && project.tasks.length > 0 && (
        <div className="glass-card rounded-2xl border border-work21-border p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-accent-violet" />
              Задачи проекта
            </h2>
            <p className="text-sm text-gray-400">
              {project.tasks.length} {project.tasks.length === 1 ? 'задача' : 'задач'}
            </p>
          </div>
          <div className="space-y-3">
            {project.tasks.map((task) => {
              const taskStatusLabels: Record<string, { label: string; color: string }> = {
                pending: { label: 'Ожидает', color: 'bg-gray-500/20 text-gray-400' },
                in_progress: { label: 'В работе', color: 'bg-accent-blue/20 text-accent-blue' },
                review: { label: 'На проверке', color: 'bg-accent-amber/20 text-accent-amber' },
                completed: { label: 'Завершена', color: 'bg-accent-green/20 text-accent-green' },
              };
              const taskStatus = taskStatusLabels[task.status] || taskStatusLabels.pending;
              return (
                <div key={task.id} className="p-4 rounded-lg bg-work21-dark/50 border border-work21-border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        task.status === 'completed' ? 'bg-accent-green' :
                        task.status === 'in_progress' ? 'bg-accent-blue' :
                        'bg-gray-500'
                      }`} />
                      <div>
                        <h3 className="text-sm font-semibold text-white">{task.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">{task.description}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${taskStatus.color}`}>
                      {taskStatus.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                    {task.estimated_hours && (
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {task.estimated_hours} ч
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Сложность: {task.complexity}/5
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const NewProjectPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    budget: '',
    deadline: '',
    tech_stack: [] as string[],
  });
  const [techStackInput, setTechStackInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimationResult, setEstimationResult] = useState<string | null>(null);
  const [estimationError, setEstimationError] = useState('');

  useEffect(() => {
    if (user && user.role !== 'customer') {
      window.location.href = '/dashboard';
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleAddTechStack = () => {
    const tech = techStackInput.trim();
    if (tech && !formData.tech_stack.includes(tech)) {
      setFormData({ ...formData, tech_stack: [...formData.tech_stack, tech] });
      setTechStackInput('');
    }
  };

  const handleRemoveTechStack = (tech: string) => {
    setFormData({ ...formData, tech_stack: formData.tech_stack.filter((t) => t !== tech) });
  };

  const handleEstimate = async () => {
    if (!formData.description.trim()) {
      setEstimationError('Сначала заполните описание проекта');
      return;
    }
    setIsEstimating(true);
    setEstimationError('');
    setEstimationResult(null);
    try {
      const response = await estimatorApi.estimate(formData.description);
      const responseContent = response.message?.content || response.response || '';
      if (response.success !== false && responseContent) {
        if (response.estimation) {
          setEstimationResult(response.estimation.data);
          const price = response.price || response.estimation.price;
          if (price) {
            setFormData({ ...formData, budget: price.toString() });
          }
        } else if (response.price) {
          setEstimationResult(responseContent);
          setFormData({ ...formData, budget: response.price.toString() });
        } else {
          setEstimationResult(responseContent);
        }
      } else {
        setEstimationError(response.error || 'Не удалось получить оценку');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setEstimationError(err.message);
      } else {
        setEstimationError('Ошибка при расчете времени выполнения');
      }
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!formData.title.trim()) {
      setError('Название проекта обязательно');
      return;
    }
    if (!formData.description.trim()) {
      setError('Описание проекта обязательно');
      return;
    }
    const budget = parseFloat(formData.budget);
    if (!formData.budget || isNaN(budget) || budget <= 0) {
      setError('Бюджет должен быть положительным числом');
      return;
    }
    setIsSubmitting(true);
    try {
      await projectsApi.create({
        title: formData.title.trim(),
        description: formData.description.trim(),
        requirements: formData.requirements.trim() || undefined,
        budget: budget,
        deadline: formData.deadline || undefined,
        tech_stack: formData.tech_stack.length > 0 ? formData.tech_stack : undefined,
        llm_estimation: estimationResult || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при создании проекта');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'customer') return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <a href="/dashboard" className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </a>
        <div>
          <h1 className="text-2xl font-bold text-white">Создать проект</h1>
          <p className="text-sm text-gray-400">Заполните информацию о проекте, чтобы найти исполнителей</p>
        </div>
      </div>
      {success && (
        <div className="glass-card rounded-xl p-4 border border-accent-green/30 bg-accent-green/10 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent-green flex-shrink-0" />
          <div>
            <p className="text-accent-green font-medium">Проект успешно создан!</p>
            <p className="text-sm text-gray-400">Перенаправление на страницу проекта...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card rounded-2xl border border-work21-border p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Основная информация</h2>
            <p className="text-sm text-gray-400">Укажите название и описание вашего проекта</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название проекта <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={255}
              className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
              placeholder="Например: Мобильное приложение для доставки"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Описание проекта <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors resize-none"
              placeholder="Подробно опишите, что нужно сделать..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Требования</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors resize-none"
              placeholder="Дополнительные требования..."
            />
          </div>
        </div>
        <div className="glass-card rounded-2xl border border-work21-border p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Детали проекта</h2>
            <p className="text-sm text-gray-400">Укажите бюджет, сроки и технологии</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-violet" />
              Оценка времени выполнения
            </label>
            <button
              type="button"
              onClick={handleEstimate}
              disabled={isEstimating || !formData.description.trim()}
              className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-accent-violet to-accent-blue border-2 border-accent-violet/50 text-white hover:from-accent-violet/90 hover:to-accent-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold"
            >
              {isEstimating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Расчет времени выполнения...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Рассчитать оценку времени выполнения</span>
                </>
              )}
            </button>
            {estimationError && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-400">{estimationError}</div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Бюджет (₽) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min="1"
                step="0.01"
                className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                placeholder="150000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Срок выполнения</label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
              />
            </div>
          </div>
          {estimationResult && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-accent-violet" />
                Оценка времени выполнения от LLM
              </label>
              <div className="px-4 py-4 rounded-lg bg-accent-violet/10 border border-accent-violet/30 text-gray-300 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
                {estimationResult}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Технологии</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTechStack();
                  }
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                placeholder="Например: React, Python, PostgreSQL"
              />
              <button
                type="button"
                onClick={handleAddTechStack}
                className="px-4 py-2 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 transition-colors"
              >
                Добавить
              </button>
            </div>
            {formData.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechStack(tech)}
                      className="hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <a href="/dashboard" className="px-6 py-3 rounded-lg bg-work21-card border border-work21-border text-gray-300 hover:border-gray-600 transition-colors">
            Отмена
          </a>
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="px-6 py-3 rounded-lg bg-accent-green text-white hover:bg-accent-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Создание...
              </>
            ) : (
              'Создать проект'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const ApplyProjectPage = ({ projectId }: { projectId: number }) => {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cover_letter: '',
    proposed_rate: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'student') {
      window.location.href = '/dashboard';
      return;
    }
    const loadProject = async () => {
      try {
        setIsLoading(true);
        const data = await projectsApi.getById(projectId);
        setProject(data);
        if (data.status !== 'open') {
          setError('Проект не открыт для заявок');
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Ошибка при загрузке проекта');
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadProject();
  }, [user, projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setIsSubmitting(true);
    setError('');
    setSuccess(false);
    try {
      await projectsApi.apply(
        projectId,
        formData.cover_letter || undefined,
        formData.proposed_rate ? parseFloat(formData.proposed_rate) : undefined
      );
      setSuccess(true);
      setTimeout(() => {
        window.location.href = `/dashboard/projects/${projectId}`;
      }, 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ошибка при подаче заявки');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'student') return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent-green animate-spin" />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="space-y-6">
        <a href={`/dashboard/projects/${projectId}`} className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors inline-flex items-center gap-2">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">Назад к проекту</span>
        </a>
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <a href={`/dashboard/projects/${projectId}`} className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </a>
        <div>
          <h1 className="text-2xl font-bold text-white">Подать заявку</h1>
          <p className="text-sm text-gray-400">{project.title}</p>
        </div>
      </div>
      {success && (
        <div className="glass-card rounded-xl p-4 border border-accent-green/30 bg-accent-green/10 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent-green flex-shrink-0" />
          <div>
            <p className="text-accent-green font-medium">Заявка успешно подана!</p>
            <p className="text-sm text-gray-400">Перенаправление на страницу проекта...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      )}
      <div className="glass-card rounded-2xl border border-work21-border p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Информация о проекте</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <DollarSignIcon className="w-4 h-4" />
              <span>Бюджет: {project.budget.toLocaleString('ru-RU')} ₽</span>
            </div>
            {project.deadline && (
              <div className="flex items-center gap-2 text-gray-400">
                <span>Срок: {new Date(project.deadline).toLocaleDateString('ru-RU')}</span>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Сопроводительное письмо
            </label>
            <textarea
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors resize-none"
              placeholder="Расскажите о своем опыте и почему вы подходите для этого проекта..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <DollarSignIcon className="w-4 h-4" />
              Предложенная ставка (опционально)
            </label>
            <input
              type="number"
              name="proposed_rate"
              value={formData.proposed_rate}
              onChange={handleChange}
              min="1"
              step="0.01"
              className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
              placeholder="Оставьте пустым, если согласны с бюджетом проекта"
            />
            <p className="text-xs text-gray-500 mt-1">
              Если вы хотите предложить другую ставку, укажите её здесь
            </p>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <a href={`/dashboard/projects/${projectId}`} className="px-6 py-3 rounded-lg bg-work21-card border border-work21-border text-gray-300 hover:border-gray-600 transition-colors">
              Отмена
            </a>
            <button
              type="submit"
              disabled={isSubmitting || success || project.status !== 'open'}
              className="px-6 py-3 rounded-lg bg-accent-green text-white hover:bg-accent-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Подать заявку
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    skills: '',
    avatar_url: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
        skills: user.skills || '',
        avatar_url: user.avatar_url || '',
      });
    }
  }, [user]);

  const skillBadges = formData.skills
    ? formData.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      await api.users.updateMe({
        ...formData,
        skills: formData.skills
          ? formData.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
          : undefined,
      });
      await refreshUser();
      setSuccessMessage('Профиль успешно обновлён');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Не удалось сохранить изменения. Попробуйте снова.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-white">Профиль</h1>
        <p className="text-gray-400">
          Обновите информацию о себе, чтобы повысить доверие заказчиков и увеличить шанс получить проект.
        </p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {successMessage && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-green-500/40 bg-green-500/10 text-green-300 text-sm">
              <CheckCircle2 className="w-5 h-5" />
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-sm">
              <AlertCircle className="w-5 h-5" />
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="glass-card rounded-2xl border border-work21-border p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Основная информация</h2>
                <p className="text-sm text-gray-400">Эти данные видны заказчикам в списках и карточках профиля.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Имя</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-green transition-colors"
                    placeholder="Иван"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Фамилия</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-green transition-colors"
                    placeholder="Сидоров"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-blue transition-colors min-h-[140px]"
                  placeholder="Опишите опыт, сильные стороны и интересы."
                />
              </div>
            </section>
            <section className="glass-card rounded-2xl border border-work21-border p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Навыки и стек</h2>
                <p className="text-sm text-gray-400">Перечислите ключевые технологии через запятую — они появятся тегами.</p>
              </div>
              <div>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-blue transition-colors min-h-[100px]"
                  placeholder="Python, FastAPI, PostgreSQL, Docker"
                />
              </div>
              {skillBadges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skillBadges.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </section>
            <section className="glass-card rounded-2xl border border-work21-border p-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Фото профиля</h2>
                <p className="text-sm text-gray-400">Укажите ссылку на изображение — поддерживается любой публичный URL.</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">URL аватара</label>
                <input
                  type="url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-blue transition-colors"
                  placeholder="https://..."
                />
              </div>
              {formData.avatar_url && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-work21-dark border border-work21-border">
                  <img
                    src={formData.avatar_url}
                    alt="Аватар"
                    className="w-16 h-16 rounded-full object-cover border border-work21-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="text-sm text-gray-400">Предпросмотр изображения профиля</div>
                </div>
              )}
            </section>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Сохраняем...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Сохранить профиль
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="space-y-6">
          <section className="glass-card rounded-2xl border border-work21-border p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center text-2xl font-semibold text-white">
                {user.first_name[0]}{user.last_name[0]}
              </div>
              <div>
                <div className="text-lg font-semibold text-white">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-sm text-gray-400 capitalize">
                  {user.role === 'student' ? 'Студент' : 'Заказчик'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-work21-dark border border-work21-border p-4">
                <div className="text-gray-400 text-sm mb-1">Рейтинг</div>
                <div className="flex items-center gap-2 text-white text-2xl font-semibold">
                  <Star className="w-5 h-5 text-accent-amber" />
                  {user.rating_score.toFixed(1)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Обновляется ежедневно</p>
              </div>
              <div className="rounded-2xl bg-work21-dark border border-work21-border p-4">
                <div className="text-gray-400 text-sm mb-1">Проекты</div>
                <div className="text-white text-2xl font-semibold">{user.completed_projects}</div>
                <p className="text-xs text-gray-500 mt-1">Успешно завершено</p>
              </div>
            </div>
          </section>
          <section className="glass-card rounded-2xl border border-work21-border p-6 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <ShieldIcon className="w-5 h-5 text-accent-blue" />
              <div className="font-semibold">Верификация аккаунта</div>
            </div>
            <p className="text-sm text-gray-400">
              Верифицированные профили получают больше доверия от заказчиков и чаще попадают в подборки AI-агентов.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle2 className={`w-4 h-4 ${user.is_verified ? 'text-accent-green' : 'text-gray-600'}`} />
              {user.is_verified ? 'Аккаунт подтверждён' : 'Ожидает подтверждения'}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ApplicationsPage = () => {
  return <div>Applications Page</div>;
};

const StudentsListPage = () => {
  return <div>Students List Page</div>;
};

const RatingPage = () => {
  return <div>Rating Page</div>;
};

const SettingsPage = () => {
  return <div>Settings Page</div>;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadProjects = async () => {
      try {
        if (user.role === 'student') {
          const [openProjects, myProjectsData] = await Promise.all([
            projectsApi.getList('open', 0, 5),
            projectsApi.getMy(),
          ]);
          setProjects(openProjects);
          const assignedProjects = myProjectsData.filter(p => p.assignee_id === user.id);
          setMyProjects(assignedProjects);
        } else {
          const data = await projectsApi.getMy();
          setProjects(data);
        }
      } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, [user]);

  if (!user) return null;

  if (user.role === 'student') {
    const stats = [
      { label: 'Рейтинг', value: user.rating_score.toFixed(1), icon: Trophy, color: 'amber', change: '+0.2 за месяц' },
      { label: 'Выполнено проектов', value: user.completed_projects, icon: CheckCircle, color: 'green', change: 'Всего' },
      { label: 'Активные заявки', value: myProjects.filter(p => p.status === 'in_progress' || p.status === 'open').length, icon: ClockIcon, color: 'blue', change: 'Ожидают ответа' },
      { label: 'В работе', value: myProjects.filter(p => p.status === 'in_progress').length, icon: FolderKanban, color: 'violet', change: 'Текущие проекты' },
    ];

    return (
      <div className="space-y-8">
        <div className="glass-card rounded-2xl p-6 border border-work21-border">
          <h2 className="text-2xl font-bold text-white mb-2">Привет, {user.first_name}! 👋</h2>
          <p className="text-gray-400">Начните зарабатывать — найдите проект, который подходит вашим навыкам.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              amber: 'bg-accent-amber/10 text-accent-amber',
              green: 'bg-accent-green/10 text-accent-green',
              blue: 'bg-accent-blue/10 text-accent-blue',
              violet: 'bg-accent-violet/10 text-accent-violet',
            };
            return (
              <div key={stat.label} className="glass-card rounded-xl p-5 border border-work21-border">
                <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]} mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.change}</div>
              </div>
            );
          })}
        </div>
        {myProjects.length > 0 && (
          <div className="glass-card rounded-2xl p-6 border border-work21-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Мои проекты</h3>
              <a href="/dashboard/projects" className="text-sm text-accent-green hover:underline">Смотреть все</a>
            </div>
            <div className="space-y-4">
              {myProjects.slice(0, 3).map((project) => (
                <a key={project.id} href={`/dashboard/projects/${project.id}`} className="block p-4 rounded-xl bg-work21-dark/50 border border-accent-green/30 hover:border-accent-green/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{project.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      project.status === 'in_progress' ? 'bg-accent-blue/20 text-accent-blue' :
                      project.status === 'completed' ? 'bg-accent-green/20 text-accent-green' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {project.status === 'in_progress' ? 'В работе' : project.status === 'completed' ? 'Завершен' : project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-400">
                      {project.deadline && (
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{new Date(project.deadline).toLocaleDateString('ru-RU')}</span>
                        </div>
                      )}
                      <div className="font-medium text-white">{project.budget.toLocaleString('ru-RU')} ₽</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-accent-green" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Customer dashboard
  const stats = [
    { label: 'Всего проектов', value: projects.length, icon: FolderKanban, color: 'green', change: 'За всё время' },
    { label: 'Активных', value: projects.filter(p => p.status === 'in_progress' || p.status === 'open').length, icon: ClockIcon, color: 'blue', change: 'В работе' },
    { label: 'Завершено', value: projects.filter(p => p.status === 'completed').length, icon: CheckCircle, color: 'amber', change: 'Успешно' },
  ];

  return (
    <div className="space-y-8">
      <div className="glass-card rounded-2xl p-6 border border-work21-border">
        <h2 className="text-2xl font-bold text-white mb-2">Добро пожаловать, {user.first_name}! 👋</h2>
        <p className="text-gray-400">Создайте свой первый проект и найдите талантливых исполнителей.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            amber: 'bg-accent-amber/10 text-accent-amber',
            green: 'bg-accent-green/10 text-accent-green',
            blue: 'bg-accent-blue/10 text-accent-blue',
            violet: 'bg-accent-violet/10 text-accent-violet',
          };
          return (
            <div key={stat.label} className="glass-card rounded-xl p-5 border border-work21-border">
              <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]} mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.change}</div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <a href="/dashboard/projects/new" className="glass-card rounded-2xl p-6 border border-accent-green/30 hover:border-accent-green/50 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent-green/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7 text-accent-green" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Создать проект</h3>
              <p className="text-sm text-gray-400">Опишите задачу и найдите исполнителей</p>
            </div>
          </div>
        </a>
        <a href="/dashboard/students" className="glass-card rounded-2xl p-6 border border-work21-border hover:border-accent-blue/30 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-accent-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Найти исполнителей</h3>
              <p className="text-sm text-gray-400">Просмотрите рейтинг студентов</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError('');
        let data: Project[];
        if (user.role === 'customer') {
          data = await projectsApi.getMy();
        } else {
          const [openProjects, myProjects] = await Promise.all([
            projectsApi.getList('open'),
            projectsApi.getMy(),
          ]);
          const allProjects = [...openProjects];
          myProjects.forEach(p => {
            if (!allProjects.find(ap => ap.id === p.id)) {
              allProjects.push(p);
            }
          });
          data = allProjects;
        }
        setProjects(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Ошибка при загрузке проектов');
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, [user]);

  if (!user) return null;

  const parseTechStack = (techStack: string | undefined): string[] => {
    if (!techStack) return [];
    try {
      if (typeof techStack === 'string' && techStack.startsWith('[')) {
        return JSON.parse(techStack);
      }
      if (Array.isArray(techStack)) {
        return techStack;
      }
      return [];
    } catch {
      return [];
    }
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    draft: { label: 'Черновик', color: 'bg-gray-500/20 text-gray-400' },
    open: { label: 'Открыт', color: 'bg-accent-green/20 text-accent-green' },
    in_progress: { label: 'В работе', color: 'bg-accent-blue/20 text-accent-blue' },
    review: { label: 'На проверке', color: 'bg-accent-amber/20 text-accent-amber' },
    completed: { label: 'Завершен', color: 'bg-accent-green/20 text-accent-green' },
    cancelled: { label: 'Отменен', color: 'bg-red-500/20 text-red-400' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {user.role === 'customer' ? 'Мои проекты' : 'Открытые проекты'}
            </h1>
            <p className="text-sm text-gray-400">
              {user.role === 'customer' 
                ? 'Управляйте своими проектами и отслеживайте их статус'
                : 'Найдите подходящий проект и подайте заявку'}
            </p>
          </div>
        </div>
        {user.role === 'customer' && (
          <a href="/dashboard/projects/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Создать проект
          </a>
        )}
      </div>

      {error && (
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent-green animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-work21-border text-center">
          <FolderKanban className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {user.role === 'customer' ? 'У вас пока нет проектов' : 'Нет доступных проектов'}
          </h3>
          <p className="text-gray-400 mb-6">
            {user.role === 'customer' 
              ? 'Создайте первый проект, чтобы начать работу'
              : 'Открытые проекты появятся здесь'}
          </p>
          {user.role === 'customer' && (
            <a href="/dashboard/projects/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Создать проект
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => {
            const techStack = parseTechStack(project.tech_stack);
            const status = statusLabels[project.status] || statusLabels.draft;
            return (
              <div key={project.id} className="glass-card rounded-2xl p-6 border border-work21-border hover:border-accent-green/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-work21-dark/50">
                    <DollarSignIcon className="w-5 h-5 text-accent-green flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Бюджет</div>
                      <div className="text-sm font-semibold text-white">{project.budget.toLocaleString('ru-RU')} ₽</div>
                    </div>
                  </div>
                  {project.deadline && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-work21-dark/50">
                      <Calendar className="w-5 h-5 text-accent-blue flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500">Срок</div>
                        <div className="text-sm font-semibold text-white">
                          {new Date(project.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-work21-dark/50">
                    <FolderKanban className="w-5 h-5 text-accent-violet flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Задач</div>
                      <div className="text-sm font-semibold text-white">{project.tasks?.length || 0}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-work21-dark/50">
                    <ClockIcon className="w-5 h-5 text-accent-amber flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Создан</div>
                      <div className="text-sm font-semibold text-white">
                        {new Date(project.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-work21-border">
                  <div className="text-xs text-gray-500">
                    ID: {project.id} • Обновлен: {new Date(project.updated_at).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="flex items-center gap-2">
                    {user.role === 'student' && project.status === 'open' && !project.assignee_id && (
                      <a href={`/dashboard/projects/${project.id}`} className="btn-primary text-sm flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Подать заявку
                      </a>
                    )}
                    <a href={`/dashboard/projects/${project.id}`} className="px-4 py-2 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/20 transition-colors text-sm flex items-center gap-2">
                      <EyeIcon className="w-4 h-4" />
                      Подробнее
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ==================== DASHBOARD LAYOUT ====================
const studentNavigation = [
  { name: 'Главная', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Проекты', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Мои заявки', href: '/dashboard/applications', icon: Briefcase },
  { name: 'Рейтинг', href: '/dashboard/rating', icon: Trophy },
  { name: 'Профиль', href: '/dashboard/profile', icon: Users },
  { name: 'Настройки', href: '/dashboard/settings', icon: Settings },
];

const customerNavigation = [
  { name: 'Главная', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Мои проекты', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Создать проект', href: '/dashboard/projects/new', icon: Plus },
  { name: 'Исполнители', href: '/dashboard/students', icon: Users },
  { name: 'Профиль', href: '/dashboard/profile', icon: Users },
  { name: 'Настройки', href: '/dashboard/settings', icon: Settings },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-accent-green mx-auto mb-4" />
            <p style={{ color: 'var(--color-text-secondary)' }}>Загрузка...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const navigation = user.role === 'customer' ? customerNavigation : studentNavigation;

  return (
    <ThemeProvider>
      <div className="min-h-screen flex transition-colors duration-300" style={{ background: 'var(--color-bg)' }}>
        <aside className="w-64 flex flex-col transition-colors duration-300" style={{ background: 'var(--color-card)', borderRight: '1px solid var(--color-border)' }}>
          <div className="p-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <a href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                WORK<span className="text-accent-green">21</span>
              </span>
            </a>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-opacity-50"
                      style={{ color: 'var(--color-text-secondary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-border)';
                        e.currentTarget.style.color = 'var(--color-text)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-3" style={{ background: 'var(--color-bg)' }}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} className="w-10 h-10 rounded-full object-cover" style={{ border: '1px solid var(--color-border)' }} />
              ) : (
                <div className="w-10 h-10 rounded-full bg-accent-green/20 flex items-center justify-center">
                  <span className="text-accent-green font-semibold">
                    {user.first_name[0]}{user.last_name[0]}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-xs capitalize" style={{ color: 'var(--color-text-secondary)' }}>
                  {user.role === 'student' ? 'Студент' : 'Заказчик'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:text-red-400 hover:bg-red-500/10"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <LogOut className="w-5 h-5" />
              <span>Выйти</span>
            </button>
          </div>
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 transition-colors duration-300" style={{ background: 'var(--color-card)', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                Добро пожаловать, {user.first_name}!
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {user.role === 'student' && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-amber/10 text-accent-amber">
                  <Trophy className="w-4 h-4" />
                  <span className="font-medium">{user.rating_score.toFixed(1)}</span>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

// ==================== DASHBOARD ROUTER ====================
const DashboardRouter = ({ path }: { path: string }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Extract project ID from path like /dashboard/projects/123
  const projectIdMatch = path.match(/\/dashboard\/projects\/(\d+)/);
  const projectId = projectIdMatch ? parseInt(projectIdMatch[1]) : null;

  if (path === '/dashboard') {
    return <DashboardLayout><DashboardPage /></DashboardLayout>;
  }

  if (path === '/dashboard/projects' || path.startsWith('/dashboard/projects/') && !path.includes('/apply') && !path.includes('/new')) {
    if (projectId) {
      return <DashboardLayout><ProjectDetailPage projectId={projectId} /></DashboardLayout>;
    }
    return <DashboardLayout><ProjectsPage /></DashboardLayout>;
  }

  if (path === '/dashboard/projects/new') {
    return <DashboardLayout><NewProjectPage /></DashboardLayout>;
  }

  if (path.match(/\/dashboard\/projects\/(\d+)\/apply/)) {
    const applyProjectId = path.match(/\/dashboard\/projects\/(\d+)\/apply/)?.[1];
    if (applyProjectId) {
      return <DashboardLayout><ApplyProjectPage projectId={parseInt(applyProjectId)} /></DashboardLayout>;
    }
  }

  if (path === '/dashboard/profile') {
    return <DashboardLayout><ProfilePage /></DashboardLayout>;
  }

  if (path === '/dashboard/applications') {
    return <DashboardLayout><ApplicationsPage /></DashboardLayout>;
  }

  if (path === '/dashboard/students') {
    return <DashboardLayout><StudentsListPage /></DashboardLayout>;
  }

  if (path === '/dashboard/rating') {
    return <DashboardLayout><RatingPage /></DashboardLayout>;
  }

  if (path === '/dashboard/settings') {
    return <DashboardLayout><SettingsPage /></DashboardLayout>;
  }

  return <DashboardLayout><div>Страница не найдена</div></DashboardLayout>;
};

// ==================== ROUTER ====================
const Router = () => {
  const [path, setPath] = useState(window.location.pathname);
  const [searchParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const url = new URL(link.href);
        window.history.pushState({}, '', url.pathname + url.search);
        setPath(url.pathname);
      }
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Public pages
  if (path === '/') {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-work21-dark text-white">
          <Header />
          <main>
            <Hero />
            <Features />
            <AIAgents />
            <HowItWorks />
            <CTA />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

  if (path === '/login') {
    return <LoginPage />;
  }

  if (path === '/register') {
    return <RegisterPage role={searchParams.get('role') as 'student' | 'customer' || 'student'} />;
  }

  if (path === '/students') {
    return <StudentsPage />;
  }

  if (path === '/customers') {
    return <CustomersPage />;
  }

  if (path === '/how-it-works') {
    return <HowItWorksPage />;
  }

  // Dashboard pages (require auth)
  if (path.startsWith('/dashboard')) {
    return <DashboardRouter path={path} />;
  }

  // 404
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-work21-dark text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-400 mb-8">Страница не найдена</p>
          <a href="/" className="btn-primary">На главную</a>
        </div>
      </div>
    </ThemeProvider>
  );
};

// ==================== APP ====================
const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
};

// ==================== BROJS EXPORTS ====================
export default () => <App />;

let rootElement: ReactDOM.Root;

export const mount = (Component: any, element: HTMLElement | null = document.getElementById('app')) => {
  if (!element) {
    console.error('Mount element not found');
    return;
  }
  
  rootElement = ReactDOM.createRoot(element);
  rootElement.render(<Component />);

  if ((module as any).hot) {
    (module as any).hot.accept(() => {
      if (rootElement) {
        rootElement.render(<Component />);
      }
    });
  }
};

export const unmount = () => {
  if (rootElement) {
    rootElement.unmount();
  }
};
