import { Users, BookOpen, Calendar } from 'lucide-react';

export const DashboardCards = () => {
  // Mock data for MVP
  const stats = [
    {
      title: 'Total de cadastros (30d)',
      value: '24',
      icon: Users,
      change: '+12%',
    },
    {
      title: 'Cursos ativos',
      value: '3',
      icon: BookOpen,
      change: 'Estável',
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs text-foreground/60">{stat.change}</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-foreground/70">{stat.title}</p>
          </div>
        );
      })}
    </div>
  );
};
