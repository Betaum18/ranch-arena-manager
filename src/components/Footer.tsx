export default function Footer() {
  return (
    <footer id="contato" className="bg-surface-darker text-sidebar-foreground py-12 border-t border-sidebar-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-lg font-bold text-gold mb-3">Ranch Sorting ABQM</h3>
            <p className="text-sidebar-foreground/70 text-sm leading-relaxed">
              Núcleo oficial filiado à Associação Brasileira de Quarto de Milha, promovendo competições de Ranch Sorting em todo o Brasil.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-3">Contato</h4>
            <p className="text-sidebar-foreground/70 text-sm">contato@ranchsortingabqm.com.br</p>
            <p className="text-sidebar-foreground/70 text-sm">(11) 99999-0000</p>
            <p className="text-sidebar-foreground/70 text-sm">São Paulo, SP — Brasil</p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-3">Links</h4>
            <p className="text-sidebar-foreground/70 text-sm">ABQM — abqm.com.br</p>
            <p className="text-sidebar-foreground/70 text-sm">Regulamento Ranch Sorting</p>
            <p className="text-sidebar-foreground/70 text-sm">Calendário de Provas</p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-sidebar-border text-center text-sidebar-foreground/50 text-xs">
          © 2026 Núcleo de Ranch Sorting — Filiado à ABQM. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
