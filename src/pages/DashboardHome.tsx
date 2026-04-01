import { Users, Trophy, FileSpreadsheet, Clock } from 'lucide-react';

const stats = [
  { label: 'Total de Inscritos', value: '0', icon: Users, color: 'text-primary' },
  { label: 'Campeonatos Ativos', value: '2', icon: Trophy, color: 'text-gold' },
  { label: 'Arquivos Enviados', value: '0', icon: FileSpreadsheet, color: 'text-primary' },
];

const recentActivity = [
  { text: 'Sistema iniciado. Bem-vindo ao Ranch Sorting ABQM!', time: 'Agora' },
  { text: 'Calendário de provas 2026 disponibilizado.', time: '1h atrás' },
  { text: '1ª Etapa — Campeonato Paulista com inscrições abertas.', time: '2 dias atrás' },
];

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
        <h1 className="font-heading text-2xl font-bold">Bem-vindo ao Painel</h1>
        <p className="text-muted-foreground mt-1">Gerencie campeonatos, inscrições e resultados do núcleo de Ranch Sorting.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-gold" /> Atividade Recente
        </h2>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div className="flex-1">
                <p className="text-foreground">{a.text}</p>
                <p className="text-muted-foreground text-xs">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
