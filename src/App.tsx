import { useState } from 'react'
import {
  BookOpen, Search, Network, ScrollText, Users, Languages,
  Map, Clock3, Bookmark, Settings, Menu, X, ArrowRight,
  Cross, Sparkles, LibraryBig
} from 'lucide-react'

const sections = [
  { label: 'Painel inicial', icon: LibraryBig },
  { label: 'Pesquisa bíblica', icon: Search },
  { label: 'Conexões entre textos', icon: Network },
  { label: 'Estudos exegéticos', icon: ScrollText },
  { label: 'Personagens bíblicos', icon: Users },
  { label: 'Línguas originais', icon: Languages },
  { label: 'Geografia bíblica', icon: Map },
  { label: 'Cronologia', icon: Clock3 },
  { label: 'Favoritos', icon: Bookmark },
]

const connectionTypes = [
  ['Citação direta', 'Um texto reproduz explicitamente palavras de outra passagem.'],
  ['Alusão', 'Referência indireta reconhecível pelo vocabulário ou contexto.'],
  ['Paralelismo', 'Correspondência de estrutura, linguagem ou ideia entre textos.'],
  ['Cumprimento profético', 'Relação entre uma profecia e seu cumprimento identificado no texto bíblico.'],
  ['Tipologia', 'Correspondência histórico-teológica entre pessoas, eventos ou instituições.'],
  ['Relação temática', 'Desenvolvimento de um mesmo tema em diferentes partes das Escrituras.'],
]

function App() {
  const [active, setActive] = useState('Painel inicial')
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><BookOpen size={25} /></div>
          <div><strong>CONEXÕES</strong><span>BÍBLICAS LOGOS</span></div>
          <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X /></button>
        </div>
        <div className="side-caption">BIBLIOTECA DE PESQUISA</div>
        <nav>
          {sections.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => { setActive(label); setMenuOpen(false) }}>
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item"><Settings size={18} /><span>Configurações</span></button>
          <div className="sidebar-note">Pesquisa responsável. Escrituras interpretadas à luz de seu contexto.</div>
          <span className="version">VERSÃO 0.1 • PROTÓTIPO</span>
        </div>
      </aside>

      {menuOpen && <button className="scrim" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" />}
      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu /></button>
          <div className="breadcrumb">BIBLIOTECA <span>/</span> {active.toUpperCase()}</div>
          <div className="topbar-right"><span className="status-dot" /> AMBIENTE DE ESTUDO</div>
        </header>

        <div className="content">
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow"><Sparkles size={14} /> EXPLORANDO AS ESCRITURAS</div>
              <h1>Uma Escritura.<br /><em>Muitas conexões.</em></h1>
              <p>Investigue as relações entre os textos bíblicos, acompanhe o desenvolvimento dos temas e aprofunde sua compreensão de Gênesis a Apocalipse.</p>
              <div className="hero-search">
                <Search size={20} />
                <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && setActive('Pesquisa bíblica')} placeholder="Pesquise uma passagem, palavra, tema ou personagem..." />
                <button onClick={() => setActive('Pesquisa bíblica')}>Pesquisar <ArrowRight size={16} /></button>
              </div>
              <div className="search-hint">EXEMPLOS: João 1:1 · Aliança · Davi · Messias · Reino de Deus</div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <div className="book-glow"><BookOpen size={94} strokeWidth={1} /></div>
              <div className="verse-chip chip-top">GÊNESIS <b>1:1</b></div>
              <div className="verse-chip chip-bottom">APOCALIPSE <b>22:21</b></div>
              <div className="gold-cross"><Cross size={38} strokeWidth={1.2} /></div>
            </div>
          </section>

          <section className="section-block">
            <div className="section-heading"><div><span className="eyebrow dark">NAVEGUE PELO CONHECIMENTO</span><h2>Áreas de pesquisa</h2></div><span className="section-index">01 / 04</span></div>
            <div className="module-grid">
              {[
                { title: 'Conexões bíblicas', desc: 'Citações, alusões, paralelismos, tipologias e cumprimento profético.', icon: Network, tag: 'TEXTO COM TEXTO' },
                { title: 'Estudos exegéticos', desc: 'Contexto histórico, literário, estrutura e análise do texto.', icon: ScrollText, tag: 'ANÁLISE DO TEXTO' },
                { title: 'Línguas originais', desc: 'Hebraico, aramaico e grego koiné com análise lexical responsável.', icon: Languages, tag: 'HEBRAICO • GREGO' },
                { title: 'Personagens e temas', desc: 'Trajetórias, acontecimentos e temas teológicos nas Escrituras.', icon: Users, tag: 'PESSOAS • TEMAS' },
              ].map(({ title, desc, icon: Icon, tag }) => (
                <button className="module-card" key={title} onClick={() => setActive(title === 'Conexões bíblicas' ? 'Conexões entre textos' : title)}>
                  <div className="module-icon"><Icon size={22} /></div><span className="module-tag">{tag}</span><h3>{title}</h3><p>{desc}</p><span className="card-arrow"><ArrowRight size={18} /></span>
                </button>
              ))}
            </div>
          </section>

          <section className="section-block connection-section">
            <div className="section-heading"><div><span className="eyebrow dark">CRITÉRIOS DE CLASSIFICAÇÃO</span><h2>Como os textos se conectam</h2></div><span className="section-index">02 / 04</span></div>
            <div className="connection-grid">
              {connectionTypes.map(([title, desc], i) => <div className="connection-item" key={title}><span className="connection-number">{String(i + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{desc}</p></div></div>)}
            </div>
          </section>

          <section className="principle-strip"><div className="principle-icon"><BookOpen size={23} /></div><div><strong>Compromisso com o texto bíblico</strong><p>As conexões serão identificadas e justificadas com referências verificáveis. Uma semelhança de palavras, por si só, não será tratada como prova de dependência ou cumprimento.</p></div></section>
          <footer><span>CONEXÕES BÍBLICAS LOGOS</span><span>FORMANDO PENSADORES • {new Date().getFullYear()}</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
