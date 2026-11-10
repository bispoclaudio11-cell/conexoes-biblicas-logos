import { useMemo, useState } from 'react'
import {
  BookOpen, Search, Network, ScrollText, Users, Languages,
  Map, Clock3, Bookmark, Settings, Menu, X, ArrowRight,
  Cross, Sparkles, LibraryBig, History, Trash2, Save, Plus,
  ChevronRight, Filter, BookMarked
} from 'lucide-react'
import { localStore, type FavoriteRecord } from './lib/storage'

type Entry = {
  id: string
  title: string
  reference: string
  category: string
  summary: string
  keywords: string[]
  detail: string
  related?: string[]
}

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
  ['Cumprimento profético', 'Relação textual entre uma profecia e seu cumprimento identificado.'],
  ['Tipologia', 'Correspondência histórico-teológica entre pessoas, eventos ou instituições.'],
  ['Relação temática', 'Desenvolvimento de um mesmo tema em diferentes partes das Escrituras.'],
]

const library: Entry[] = [
  { id:'c1', title:'O Verbo e a criação', reference:'Gênesis 1:1; João 1:1-3', category:'Conexão bíblica', summary:'A criação em Gênesis e a apresentação do Logos no prólogo joanino.', keywords:['criação','verbo','logos','princípio','jesus'], detail:'Gênesis abre com a ação criadora de Deus. João retoma deliberadamente a expressão “no princípio” e apresenta o Logos como aquele que estava com Deus e era Deus, por meio de quem todas as coisas vieram a existir. A relação é uma alusão literária e teológica ao relato da criação, não uma citação formal de Gênesis 1:1.', related:['Gênesis 1:1','João 1:1-3','Colossenses 1:16-17'] },
  { id:'c2', title:'O Filho de Davi e o Senhor de Davi', reference:'Salmos 110:1; Mateus 22:41-46', category:'Conexão bíblica', summary:'Jesus usa o Salmo 110 para discutir a identidade e autoridade do Messias.', keywords:['davi','messias','cristo','senhor','salmos'], detail:'Jesus pergunta como o Cristo pode ser chamado Filho de Davi se Davi, falando pelo Espírito, o chama de “meu Senhor”. O argumento não nega a descendência davídica; mostra que a identidade do Messias ultrapassa a condição de mero sucessor humano. O Salmo 110:1 é citado diretamente em Mateus 22:44.', related:['Marcos 12:35-37','Lucas 20:41-44','Atos 2:34-36','Hebreus 1:13'] },
  { id:'c3', title:'Do Egito chamei o meu Filho', reference:'Oseias 11:1; Mateus 2:15', category:'Conexão bíblica', summary:'Mateus aplica a história de Israel à trajetória de Jesus.', keywords:['egito','israel','jesus','filho','tipologia'], detail:'Em Oseias 11:1, o contexto imediato recorda o êxodo de Israel, chamado por Deus de filho. Mateus 2:15 aplica essa linguagem a Jesus. A leitura é frequentemente entendida como tipológica: Jesus recapitula a história de Israel. Não se deve apagar o sentido histórico original de Oseias nem tratar o versículo como previsão isolada sem considerar seu contexto.', related:['Êxodo 4:22-23','Oseias 11:1','Mateus 2:13-15'] },
  { id:'c4', title:'Cristo, nossa Páscoa', reference:'Êxodo 12:1-14; 1 Coríntios 5:7', category:'Conexão bíblica', summary:'Paulo relaciona a imagem pascal à obra de Cristo.', keywords:['pascoa','cordeiro','sangue','cristo','tipologia'], detail:'Êxodo 12 descreve a instituição da Páscoa no contexto da libertação do Egito. Em 1 Coríntios 5:7, Paulo declara: “Cristo, nossa páscoa, foi sacrificado por nós”. A relação é tipológica e explicitamente formulada pelo apóstolo. A tipologia preserva o acontecimento histórico do êxodo e identifica sua correspondência cristológica.', related:['Êxodo 12:1-14','João 1:29','1 Coríntios 5:7','1 Pedro 1:18-19'] },
  { id:'c5', title:'A pedra rejeitada', reference:'Salmos 118:22; Mateus 21:42; 1 Pedro 2:7', category:'Conexão bíblica', summary:'A pedra rejeitada torna-se fundamento na interpretação do Novo Testamento.', keywords:['pedra','rejeição','cristo','salmos','edificio'], detail:'O Salmo 118:22 utiliza a imagem da pedra rejeitada pelos construtores que se torna principal. Jesus aplica o texto a si mesmo em Mateus 21:42, e 1 Pedro 2:7 retoma a mesma passagem. Há citação explícita e aplicação cristológica. O contexto do salmo deve ser considerado antes da aplicação feita no Novo Testamento.', related:['Salmos 118:22-23','Mateus 21:33-46','Atos 4:11','1 Pedro 2:4-8'] },
  { id:'c6', title:'O grande mandamento', reference:'Deuteronômio 6:4-5; Marcos 12:28-34', category:'Conexão bíblica', summary:'Jesus reafirma o Shemá e o amor integral a Deus.', keywords:['shema','amor','mandamento','deus','israel'], detail:'Deuteronômio 6:4-5 começa com a confissão conhecida como Shemá: Israel deve ouvir e reconhecer a unicidade do Senhor, amando-o com todo o coração, alma e força. Em Marcos 12:29-30, Jesus cita essa confissão e a apresenta como o primeiro mandamento. Trata-se de citação direta, seguida da associação com Levítico 19:18.', related:['Deuteronômio 6:4-5','Levítico 19:18','Marcos 12:28-34','Mateus 22:34-40'] },
  { id:'e1', title:'O prólogo do Evangelho de João', reference:'João 1:1-18', category:'Estudo exegético', summary:'Estrutura, contexto, vocabulário e cristologia do prólogo.', keywords:['joão','logos','verbo','encarnação','cristologia'], detail:'CONTEXTO LITERÁRIO: o prólogo introduz temas desenvolvidos ao longo do Evangelho: vida, luz, testemunho, rejeição, fé e revelação do Pai. ESTRUTURA DE ESTUDO: (1) o Logos antes da criação (1:1-2); (2) sua atuação criadora (1:3-5); (3) o testemunho de João (1:6-8); (4) a rejeição e recepção da luz (1:9-13); (5) a encarnação (1:14); (6) o testemunho e a revelação (1:15-18). QUESTÃO EXEGÉTICA: observe a função de “Logos” no contexto judaico e no ambiente de língua grega, sem reduzir o termo a uma única definição lexical.', related:['Gênesis 1:1','Provérbios 8:22-31','João 1:1-18','1 João 1:1-2'] },
  { id:'e2', title:'A justificação pela fé', reference:'Romanos 3:21-31; 4:1-25', category:'Estudo exegético', summary:'A justiça de Deus, a fé e o exemplo de Abraão.', keywords:['paulo','justificação','fé','abraão','graça'], detail:'CONTEXTO: Paulo desenvolve a universalidade do pecado e apresenta a justiça de Deus revelada em Cristo. OBSERVAÇÕES: Romanos 3:21-26 concentra a exposição da justiça de Deus; 3:27-31 trata da exclusão da vanglória e da relação entre fé e lei; capítulo 4 recorre a Abraão para demonstrar que a fé não é mérito humano. Leia o argumento contínuo, observando conectivos e repetições.', related:['Gênesis 15:6','Salmos 32:1-2','Romanos 3:21-31','Gálatas 3:6-14'] },
  { id:'p1', title:'Davi', reference:'1 Samuel 16; 17; 2 Samuel 5-7', category:'Personagem bíblico', summary:'Pastor, músico, guerreiro e rei; a aliança davídica ocupa lugar central em sua história.', keywords:['davi','rei','israel','golias','aliança'], detail:'ORIGEM E CHAMADO: filho de Jessé, de Belém, ungido por Samuel (1 Samuel 16). ASCENSÃO: torna-se conhecido no episódio de Golias (1 Samuel 17), passa por conflitos com Saul e é reconhecido como rei. REINADO: conquista Jerusalém e estabelece ali sua capital (2 Samuel 5). ALIANÇA: 2 Samuel 7 registra a promessa relacionada à sua casa e descendência. LEITURA RESPONSÁVEL: a narrativa também registra falhas graves de Davi e suas consequências (2 Samuel 11-12).', related:['1 Samuel 16:1-13','1 Samuel 17','2 Samuel 5:1-10','2 Samuel 7:1-17','Salmos 51'] },
  { id:'p2', title:'Paulo', reference:'Atos 9; 13-28; Gálatas 1-2', category:'Personagem bíblico', summary:'Apóstolo dos gentios, missionário e autor de cartas do Novo Testamento.', keywords:['paulo','saulo','apostolo','gentios','missões'], detail:'CONVERSÃO E CHAMADO: Atos 9 narra o encontro de Saulo com Jesus no caminho de Damasco; Gálatas 1 apresenta a compreensão do próprio Paulo sobre seu chamado. MISSÃO: Atos 13-28 registra viagens, proclamação e prisões. CARTAS: suas epístolas tratam de evangelho, igreja, justificação, santidade, esperança e vida comunitária. Diferencie os dados narrados em Atos das informações autobiográficas das cartas.', related:['Atos 9:1-22','Atos 13-28','Gálatas 1:11-24','Filipenses 3:4-14'] },
  { id:'l1', title:'בְּרֵאשִׁית — bereshit', reference:'Gênesis 1:1', category:'Línguas originais', summary:'Expressão hebraica traduzida tradicionalmente por “no princípio”.', keywords:['hebraico','bereshit','principio','genesis','criação'], detail:'FORMA: בְּרֵאשִׁית (bereshit), expressão formada pela preposição בְּ (be, “em/no”) e רֵאשִׁית (reshit, “princípio”, “começo”, “primeira parte”). CONTEXTO: inicia a narrativa da criação. OBSERVAÇÃO: a discussão sobre a construção sintática de Gênesis 1:1 envolve a relação com o versículo 2; não se deve resolver a questão apenas por uma definição de dicionário. A análise deve considerar gramática, sintaxe e contexto literário.', related:['Gênesis 1:1-3','Isaías 46:10','João 1:1'] },
  { id:'l2', title:'לֵב / לֵבָב — lev / levav', reference:'Deuteronômio 6:5', category:'Línguas originais', summary:'Termos hebraicos traduzidos por “coração”, abrangendo interioridade, pensamento e vontade.', keywords:['hebraico','lev','levav','coração','mente'], detail:'VOCABULÁRIO: לֵב (lev) e לֵבָב (levav) são formas relacionadas, traduzidas frequentemente por “coração”. No uso bíblico, o coração não se limita às emoções: pode envolver pensamento, intenção, decisão e disposição interior. CONTEXTO: em Deuteronômio 6:5, amar a Deus de todo o coração expressa devoção integral. Evite impor a divisão moderna entre razão e emoção ao conceito hebraico.', related:['Deuteronômio 6:5','1 Samuel 16:7','Salmos 51:10','Provérbios 4:23'] },
  { id:'l3', title:'λόγος — logos', reference:'João 1:1-14', category:'Línguas originais', summary:'Substantivo grego com campo semântico amplo: palavra, discurso, mensagem ou razão, conforme o contexto.', keywords:['grego','logos','verbo','palavra','joão'], detail:'FORMA: λόγος (logos), substantivo masculino. CAMPO SEMÂNTICO: palavra, declaração, discurso, mensagem, relato ou razão, dependendo do contexto. EM JOÃO 1: o termo é apresentado de modo pessoal e elevado: o Logos estava com Deus, era Deus e se fez carne (João 1:1,14). Não basta escolher uma tradução de léxico; a identidade do Logos é construída pelo argumento do prólogo e pelo conjunto do Evangelho.', related:['João 1:1-18','1 João 1:1','Apocalipse 19:13'] },
  { id:'l4', title:'μετάνοια — metanoia', reference:'Marcos 1:15; Atos 2:38', category:'Línguas originais', summary:'Substantivo grego relacionado ao arrependimento e à mudança de mente e orientação.', keywords:['grego','metanoia','arrependimento','conversão'], detail:'FORMA: μετάνοια (metanoia), substantivo feminino; relacionado ao verbo μετανοέω (metanoeō). TRADUÇÃO: arrependimento. CONTEXTO: em Marcos 1:15, o chamado ao arrependimento está ligado à chegada do Reino de Deus e à fé no evangelho. Em Atos 2:38, aparece no apelo de Pedro. Não reduza o termo a “sentir tristeza”: seu sentido deve ser determinado pelo uso e pelo contexto de conversão e resposta a Deus.', related:['Marcos 1:14-15','Lucas 3:8','Atos 2:37- acciones'] },
  { id:'g1', title:'Jerusalém', reference:'2 Samuel 5:6-10; 1 Reis 8; Lucas 19', category:'Geografia bíblica', summary:'Cidade central na história da monarquia, do templo e dos acontecimentos finais do ministério de Jesus.', keywords:['jerusalem','sião','templo','davi','judá'], detail:'LOCALIZAÇÃO: região montanhosa da Judeia. HISTÓRIA BÍBLICA: Davi tomou a fortaleza de Sião e estabeleceu ali sua capital (2 Samuel 5:6-10). Salomão edificou o templo (1 Reis 6-8). No Novo Testamento, Jerusalém é cenário de momentos decisivos do ministério de Jesus, de sua morte e ressurreição, e do início da missão apostólica (Lucas 19-24; Atos 1-2). Para mapas históricos, considere que limites urbanos e nomes de áreas variaram ao longo dos períodos.', related:['2 Samuel 5:6-10','1 Reis 8','Lucas 19:28-48','Atos 2:1-41'] },
  { id:'g2', title:'Belém', reference:'Rute 1:1-2; 1 Samuel 16:1; Mateus 2:1', category:'Geografia bíblica', summary:'Localidade de Judá associada à família de Davi e ao nascimento de Jesus.', keywords:['belem','judá','davi','jesus','nascimento'], detail:'LOCALIZAÇÃO: cidade ao sul de Jerusalém, na região montanhosa de Judá. REFERÊNCIAS: Rute 1:1-2 situa ali a família de Elimeleque; 1 Samuel 16:1 identifica Jessé como belemita; Mateus 2:1 localiza em Belém o nascimento de Jesus. A associação messiânica também aparece em Miqueias 5:2, citado em Mateus 2:5-6.', related:['Rute 1:1-2','1 Samuel 16:1','Miqueias 5:2','Mateus 2:1-6'] },
  { id:'t1', title:'Patriarcas e êxodo', reference:'Gênesis 12 – Êxodo 15', category:'Cronologia bíblica', summary:'Da chamada de Abraão à libertação de Israel do Egito.', keywords:['abraão','israel','egito','moisés','êxodo'], detail:'SEQUÊNCIA NARRATIVA: (1) chamado de Abraão (Gênesis 12); (2) histórias de Isaque e Jacó; (3) José no Egito (Gênesis 37-50); (4) crescimento dos israelitas e opressão (Êxodo 1); (5) chamado de Moisés (Êxodo 3); (6) pragas e saída do Egito (Êxodo 7-12); (7) travessia do mar e cântico (Êxodo 14-15). DATAS: a cronologia absoluta do período é debatida; não atribua um ano exato sem declarar a hipótese adotada.', related:['Gênesis 12:1-9','Gênesis 37-50','Êxodo 3','Êxodo 12-15'] },
  { id:'t2', title:'Monarquia unida', reference:'1 Samuel 8 – 1 Reis 11', category:'Cronologia bíblica', summary:'Período narrativo dos reinados de Saul, Davi e Salomão.', keywords:['saul','davi','salomão','rei','monarquia'], detail:'SEQUÊNCIA: (1) pedido por um rei e reinado de Saul (1 Samuel 8-15); (2) ascensão e reinado de Davi (1 Samuel 16 – 2 Samuel 24; 1 Crônicas 11-29); (3) reinado de Salomão e construção do templo (1 Reis 1-11; 2 Crônicas 1-9). A divisão do reino ocorre após a morte de Salomão, em 1 Reis 12. As datas convencionais dependem de sincronismos e reconstruções cronológicas.', related:['1 Samuel 8-15','2 Samuel 5-7','1 Reis 1-11','1 Reis 12'] },
]

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()

function App() {
  const [active, setActive] = useState('Painel inicial')
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState<Entry | null>(null)
  const [history, setHistory] = useState(() => localStore.getSearchHistory())
  const [favorites, setFavorites] = useState<FavoriteRecord[]>(() => localStore.getFavorites())
  const [notes, setNotes] = useState(() => localStorage.getItem('conexoes-biblicas-logos:notes') || '')
  const [noteSaved, setNoteSaved] = useState(false)
  const [category, setCategory] = useState('Todas')

  const results = useMemo(() => {
    const term = normalize(submitted)
    if (!term) return []
    return library.filter(item => normalize([item.title,item.reference,item.category,item.summary,...item.keywords].join(' ')).includes(term))
  }, [submitted])

  const categoryResults = useMemo(() => {
    const allowed = active === 'Conexões entre textos' ? ['Conexão bíblica'] :
      active === 'Estudos exegéticos' ? ['Estudo exegético'] :
      active === 'Personagens bíblicos' ? ['Personagem bíblico'] :
      active === 'Línguas originais' ? ['Línguas originais'] :
      active === 'Geografia bíblica' ? ['Geografia bíblica'] :
      active === 'Cronologia' ? ['Cronologia bíblica'] : []
    let items = allowed.length ? library.filter(x => allowed.includes(x.category)) : library
    if (category !== 'Todas') items = items.filter(x => x.category === category)
    return items
  }, [active, category])

  function runSearch(value = query) {
    const term = value.trim()
    if (!term) return
    setQuery(term)
    setSubmitted(term)
    setActive('Pesquisa bíblica')
    setSelected(null)
    setHistory(localStore.addSearch(term))
    setMenuOpen(false)
  }

  function openSection(label: string) {
    setActive(label); setSelected(null); setSubmitted(''); setCategory('Todas'); setMenuOpen(false)
  }

  function addFavorite(item: Entry) {
    setFavorites(localStore.addFavorite({ title:item.title, reference:item.reference, category:item.category, notes:item.summary }))
  }

  function isFavorite(item: Entry) {
    return favorites.some(f => f.title === item.title && f.reference === item.reference)
  }

  function removeFavorite(id: string) {
    setFavorites(localStore.removeFavorite(id))
  }

  const pageTitle = selected ? selected.title : active
  const pageItems = active === 'Favoritos' ? [] : categoryResults

  return (
    <div className="app-shell">
      <aside className={\`sidebar \${menuOpen ? 'sidebar-open' : ''}\`}>
        <div className="brand">
          <div className="brand-mark"><BookOpen size={25} /></div>
          <div><strong>CONEXÕES</strong><span>BÍBLICAS LOGOS</span></div>
          <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X /></button>
        </div>
        <div className="side-caption">BIBLIOTECA DE PESQUISA</div>
        <nav>{sections.map(({ label, icon: Icon }) => (
          <button key={label} className={\`nav-item \${active === label ? 'active' : ''}\`} onClick={() => openSection(label)}>
            <Icon size={18} /><span>{label}</span>
          </button>
        ))}</nav>
        <div className="sidebar-bottom">
          <button className={\`nav-item \${active === 'Configurações' ? 'active' : ''}\`} onClick={() => openSection('Configurações')}><Settings size={18} /><span>Configurações</span></button>
          <div className="sidebar-note">Pesquisa responsável. Escrituras interpretadas à luz de seu contexto.</div>
          <span className="version">VERSÃO 0.2 • ACERVO INICIAL</span>
        </div>
      </aside>
      {menuOpen && <button className="scrim" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" />}
      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu /></button>
          <div className="breadcrumb">BIBLIOTECA <span>/</span> {pageTitle.toUpperCase()}</div>
          <div className="topbar-right"><span className="status-dot" /> PESQUISA LOCAL</div>
        </header>
        <div className="content">
          {selected ? (
            <section className="detail-page">
              <button className="back-link" onClick={() => setSelected(null)}>← Voltar para {active}</button>
              <span className="eyebrow dark">{selected.category.toUpperCase()}</span>
              <h1>{selected.title}</h1>
              <div className="reference-pill"><BookOpen size={16}/>{selected.reference}</div>
              <p className="detail-summary">{selected.summary}</p>
              <div className="detail-panel"><h2>Notas de estudo</h2><p>{selected.detail}</p></div>
              {selected.related && <div className="detail-panel"><h2>Referências para leitura comparada</h2><div className="reference-list">{selected.related.map(ref => <span key={ref}>{ref}</span>)}</div></div>}
              <div className="detail-actions"><button className="primary-action" onClick={() => addFavorite(selected)}><Bookmark size={16}/>{isFavorite(selected) ? 'Salvar novamente' : 'Adicionar aos favoritos'}</button></div>
            </section>
          ) : active === 'Painel inicial' ? (
            <>
              <section className="hero">
                <div className="hero-copy">
                  <div className="eyebrow"><Sparkles size={14} /> EXPLORANDO AS ESCRITURAS</div>
                  <h1>Uma Escritura.<br /><em>Muitas conexões.</em></h1>
                  <p>Investigue as relações entre os textos bíblicos, acompanhe o desenvolvimento dos temas e aprofunde sua compreensão de Gênesis a Apocalipse.</p>
                  <div className="hero-search"><Search size={20}/><input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && runSearch()} placeholder="Pesquise uma referência, palavra, tema ou personagem..."/><button onClick={() => runSearch()}>Pesquisar <ArrowRight size={16}/></button></div>
                  <div className="search-hint">EXEMPLOS: João 1 · Davi · aliança · Logos · Páscoa</div>
                </div>
                <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="book-glow"><BookOpen size={94} strokeWidth={1}/></div><div className="verse-chip chip-top">GÊNESIS <b>1:1</b></div><div className="verse-chip chip-bottom">APOCALIPSE <b>22:21</b></div><div className="gold-cross"><Cross size={38} strokeWidth={1.2}/></div></div>
              </section>
              <section className="section-block">
                <div className="section-heading"><div><span className="eyebrow dark">NAVEGUE PELO CONHECIMENTO</span><h2>Áreas de pesquisa</h2></div><span className="section-index">01 / 04</span></div>
                <div className="module-grid">{[
                  {title:'Conexões bíblicas',desc:'Citações, alusões, paralelismos, tipologias e cumprimento profético.',icon:Network,section:'Conexões entre textos',tag:'TEXTO COM TEXTO'},
                  {title:'Estudos exegéticos',desc:'Contexto histórico, literário, estrutura e análise do texto.',icon:ScrollText,section:'Estudos exegéticos',tag:'ANÁLISE DO TEXTO'},
                  {title:'Línguas originais',desc:'Hebraico, aramaico e grego koiné com análise lexical responsável.',icon:Languages,section:'Línguas originais',tag:'HEBRAICO • GREGO'},
                  {title:'Personagens bíblicos',desc:'Trajetórias, acontecimentos e temas teológicos nas Escrituras.',icon:Users,section:'Personagens bíblicos',tag:'PESSOAS • TEMAS'},
                ].map(({title,desc,icon:Icon,section,tag}) => <button className="module-card" key={title} onClick={() => openSection(section)}><div className="module-icon"><Icon size={22}/></div><span className="module-tag">{tag}</span><h3>{title}</h3><p>{desc}</p><span className="card-arrow"><ArrowRight size={18}/></span></button>)}</div>
              </section>
              <section className="section-block">
                <div className="section-heading"><div><span className="eyebrow dark">RETOME SEUS ESTUDOS</span><h2>Pesquisas recentes</h2></div><span className="section-index">{history.length} SALVAS</span></div>
                {history.length ? <div className="history-list">{history.slice(0,5).map(h => <button key={h.id} onClick={() => runSearch(h.query)}><History size={16}/><span>{h.query}</span><ChevronRight size={16}/></button>)}</div> : <p className="empty-state">Suas pesquisas aparecerão aqui depois da primeira consulta.</p>}
              </section>
              <section className="section-block connection-section"><div className="section-heading"><div><span className="eyebrow dark">CRITÉRIOS DE CLASSIFICAÇÃO</span><h2>Como os textos se conectam</h2></div><span className="section-index">02 / 04</span></div><div className="connection-grid">{connectionTypes.map(([title,desc],i)=><div className="connection-item" key={title}><span className="connection-number">{String(i+1).padStart(2,'0')}</span><div><h3>{title}</h3><p>{desc}</p></div></div>)}</div></section>
              <section className="principle-strip"><div className="principle-icon"><BookOpen size={23}/></div><div><strong>Compromisso com o texto bíblico</strong><p>As conexões são identificadas e justificadas com referências. Semelhança de palavras, por si só, não prova dependência ou cumprimento.</p></div></section>
            </>
          ) : active === 'Pesquisa bíblica' ? (
            <section className="workspace">
              <div className="workspace-heading"><span className="eyebrow dark">CONSULTA AO ACERVO</span><h1>Pesquisa bíblica</h1><p>Pesquise nos estudos e registros disponíveis nesta versão.</p></div>
              <div className="search-large"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runSearch()} placeholder="Digite referência, palavra, tema ou personagem"/><button onClick={()=>runSearch()}>Buscar</button></div>
              {submitted && <div className="results-heading"><h2>Resultados para “{submitted}”</h2><span>{results.length} resultado(s)</span></div>}
              {submitted && results.length===0 && <p className="empty-state">Nenhum registro encontrado no acervo inicial. Tente uma palavra-chave como “Davi”, “Logos”, “Páscoa” ou uma referência cadastrada.</p>}
              <div className="result-list">{results.map(item=><ResultCard key={item.id} item={item} onOpen={()=>setSelected(item)} onSave={()=>addFavorite(item)} saved={isFavorite(item)}/>)}</div>
              {!submitted && <div className="suggestions"><h3>Experimente pesquisar</h3>{['João 1','Davi','Logos','Páscoa','justificação','Jerusalém'].map(x=><button key={x} onClick={()=>runSearch(x)}>{x}</button>)}</div>}
            </section>
          ) : active === 'Favoritos' ? (
            <section className="workspace"><div className="workspace-heading"><span className="eyebrow dark">SUA BIBLIOTECA PESSOAL</span><h1>Favoritos</h1><p>Registros guardados neste navegador.</p></div>
              {favorites.length ? <div className="result-list">{favorites.map(f=><div className="result-card" key={f.id}><div className="result-top"><span className="module-tag">{f.category}</span><button className="icon-button" onClick={()=>removeFavorite(f.id)} title="Remover favorito"><Trash2 size={16}/></button></div><h3>{f.title}</h3><span className="result-reference">{f.reference}</span><p>{f.notes}</p><span className="saved-date">Salvo em {new Date(f.savedAt).toLocaleDateString('pt-BR')}</span></div>)}</div> : <p className="empty-state">Você ainda não salvou estudos. Abra um registro e use “Adicionar aos favoritos”.</p>}
            </section>
          ) : active === 'Configurações' ? (
            <section className="workspace"><div className="workspace-heading"><span className="eyebrow dark">PREFERÊNCIAS LOCAIS</span><h1>Configurações</h1><p>Os dados deste aplicativo permanecem no navegador utilizado.</p></div>
              <div className="detail-panel"><h2>Anotações pessoais</h2><p>Use este espaço para guardar observações gerais de pesquisa. Elas ficam apenas neste navegador.</p><textarea className="notes-area" value={notes} onChange={e=>{setNotes(e.target.value);setNoteSaved(false)}} placeholder="Escreva suas anotações..."/><button className="primary-action" onClick={()=>{localStorage.setItem('conexoes-biblicas-logos:notes',notes);setNoteSaved(true)}}><Save size={16}/>Salvar anotações</button>{noteSaved&&<span className="saved-feedback">Anotações salvas neste navegador.</span>}</div>
              <div className="detail-panel"><h2>Privacidade e armazenamento</h2><p>Histórico, favoritos e anotações são armazenados localmente. Não há conta, sincronização ou envio desses dados para um servidor. Limpar os dados do navegador pode apagá-los.</p><p><strong>Histórico:</strong> {history.length} pesquisa(s) registradas. <strong>Favoritos:</strong> {favorites.length} item(ns).</p><button className="secondary-action" onClick={()=>{if(confirm('Apagar todo o histórico de pesquisas deste navegador?'))setHistory((localStore.clearSearchHistory(),[]))}}><Trash2 size={15}/>Limpar histórico</button></div>
            </section>
          ) : (
            <section className="workspace">
              <div className="workspace-heading"><span className="eyebrow dark">ACERVO TEMÁTICO</span><h1>{active}</h1><p>{active === 'Conexões entre textos' ? 'Relações identificadas entre passagens, com classificação e justificativa contextual.' : 'Consulte os registros disponíveis e abra cada ficha para aprofundar o estudo.'}</p></div>
              <div className="filter-row"><Filter size={16}/><label htmlFor="category-filter">Filtrar:</label><select id="category-filter" value={category} onChange={e=>setCategory(e.target.value)}><option>Todas</option>{[...new Set(categoryResults.map(x=>x.category))].map(c=><option key={c}>{c}</option>)}</select><span>{pageItems.length} registro(s)</span></div>
              {active === 'Conexões entre textos' && <div className="connection-grid compact">{connectionTypes.map(([title,desc],i)=><div className="connection-item" key={title}><span className="connection-number">{String(i+1).padStart(2,'0')}</span><div><h3>{title}</h3><p>{desc}</p></div></div>)}</div>}
              <div className="result-list">{pageItems.map(item=><ResultCard key={item.id} item={item} onOpen={()=>setSelected(item)} onSave={()=>addFavorite(item)} saved={isFavorite(item)}/>)}</div>
              {!pageItems.length && <p className="empty-state">Não há registros nesta categoria no acervo inicial.</p>}
            </section>
          )}
          <footer><span>CONEXÕES BÍBLICAS LOGOS</span><span>FORMANDO PENSADORES • {new Date().getFullYear()}</span></footer>
        </div>
      </main>
    </div>
  )
}

function ResultCard({item,onOpen,onSave,saved}:{item:Entry;onOpen:()=>void;onSave:()=>void;saved:boolean}) {
  return <article className="result-card"><div className="result-top"><span className="module-tag">{item.category}</span><button className="icon-button" onClick={onSave} title="Adicionar aos favoritos"><Bookmark size={16} fill={saved?'currentColor':'none'}/></button></div><button className="result-title" onClick={onOpen}><h3>{item.title}</h3><ArrowRight size={17}/></button><span className="result-reference">{item.reference}</span><p>{item.summary}</p><button className="read-more" onClick={onOpen}>Abrir estudo <ChevronRight size={15}/></button></article>
}

export default App
