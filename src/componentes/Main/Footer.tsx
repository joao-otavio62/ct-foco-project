const MODALITIES = ["Funcional", "Musculação", "Pilates", "Fisioterapia"];

export function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 py-12 px-6 md:px-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-start">
        {/* Logo + descrição */}
        <div>
          <div className="font-display font-black text-3xl tracking-widest mb-3">
            CT <span className="text-red-600">FOCO</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Treinamento funcional, Musculação, Pilates e Fisioterapia com foco em resultados reais.
          </p>
        </div>

        {/* Modalidades */}
        <div>
          <h4 className="text-xs tracking-[0.3em] uppercase text-gray-600 mb-4">Modalidades</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            {MODALITIES.map(item => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-red-600 rounded-full" /> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h4 className="text-xs tracking-[0.3em] uppercase text-gray-600 mb-4">Contato</h4>
          <p className="text-gray-400 text-sm mb-2">📍 Rua Sartunino Jose Soares, 561, Fatima</p>
          <p className="text-gray-400 text-sm mb-2">📞 (73) 99999-9999</p>
          <p className="text-gray-400 text-sm">⏰ Seg–Sext: 07h00 – 22h00</p>
        </div>
      </div>

      {/* Barra do Bottom */}
      <div className="max-w-6xl mx-auto border-t border-neutral-900 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-700 text-xs tracking-widest">
          © 2025 CT FOCO. Todos os direitos reservados.
        </p>
        <div className="flex gap-1 text-gray-700 text-xs">
          <span>Feito com</span>
          <span className="text-red-600">♥</span>
          <span>para quem tem foco.</span>
        </div>
      </div>
    </footer>
  );
}