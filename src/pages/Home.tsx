import { Link } from 'react-router-dom';
import { Lasso, Trophy, Users, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import heroImage from '@/assets/hero-ranch.jpg';

const features = [
  {
    icon: Lasso,
    title: 'O que é Ranch Sorting?',
    description: 'Uma prova equestre onde duplas de cavaleiros devem apartar e conduzir o gado numerado em ordem crescente, dentro de um tempo limite. Velocidade, técnica e parceria com o cavalo são essenciais.',
  },
  {
    icon: Trophy,
    title: 'Como funcionam as competições?',
    description: 'As provas seguem o regulamento oficial da ABQM, com categorias por nível de experiência. Os participantes acumulam pontos ao longo do campeonato para o ranking geral.',
  },
  {
    icon: Users,
    title: 'Como participar?',
    description: 'Basta ter um cavalo Quarto de Milha registrado na ABQM e se inscrever nos campeonatos do nosso núcleo. Aceitamos cavaleiros de todos os níveis, do iniciante ao profissional.',
  },
];

const events = [
  { id: '1', title: '1ª Etapa — Campeonato Paulista', date: '15 de Maio, 2026', location: 'Haras São Jorge, Itu - SP', status: 'Inscrições Abertas' as const },
  { id: '2', title: '2ª Etapa — Copa Interior', date: '20 de Junho, 2026', location: 'Centro Hípico Ribeirão, Ribeirão Preto - SP', status: 'Em Breve' as const },
  { id: '3', title: '3ª Etapa — Circuito Nacional', date: '12 de Agosto, 2026', location: 'Parque de Exposições, Goiânia - GO', status: 'Em Breve' as const },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Competição de Ranch Sorting" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-darker/80 via-surface-darker/60 to-surface-darker/90" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary-foreground uppercase tracking-wide leading-tight">
            Núcleo de <span className="text-primary">Ranch</span> <span className="text-gold">Sorting</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-sidebar-foreground/80 font-body max-w-xl mx-auto">
            Organizando competições oficiais filiadas à ABQM com tradição, paixão e excelência no Quarto de Milha.
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-heading uppercase tracking-wider text-lg px-8">
            <a href="#campeonatos">Ver Campeonatos <ArrowRight className="ml-2 h-5 w-5" /></a>
          </Button>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center uppercase tracking-wider mb-12">
            Sobre o <span className="text-primary">Ranch Sorting</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-card rounded-lg p-6 border border-border hover:border-primary/40 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campeonatos */}
      <section id="campeonatos" className="py-20 bg-surface-darker">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center uppercase tracking-wider text-primary-foreground mb-12">
            Próximos <span className="text-gold">Campeonatos</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((e) => (
              <div key={e.id} className="bg-surface-dark rounded-lg border border-sidebar-border p-6 hover:border-primary/50 transition-colors">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${
                  e.status === 'Inscrições Abertas'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-gold/20 text-gold'
                }`}>
                  {e.status}
                </span>
                <h3 className="font-heading text-lg font-bold text-primary-foreground mb-3">{e.title}</h3>
                <div className="space-y-2 text-sidebar-foreground/70 text-sm">
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gold" />{e.date}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" />{e.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
