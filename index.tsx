/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React, { createContext, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Zap, Menu, X, Sun, Moon, ArrowRight, Sparkles, Users, Shield,
  Rocket, Eye, ShieldCheck, Trophy, Briefcase, TrendingUp,
  Brain, UserSearch, FileCheck, ClipboardList, Bot, Code, CheckCircle,
  Github, MessageCircle, Mail
} from 'lucide-react';
import './styles/global.css';

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

// ==================== APP ====================
const App = () => {
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
