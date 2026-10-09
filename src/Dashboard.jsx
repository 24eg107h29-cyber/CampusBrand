import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Aperture, Search, Plus, LayoutDashboard, Images, CheckCircle2, FileClock, Trash2, ExternalLink, X, Palette, Sparkles, Menu, LogOut } from 'lucide-react';

const api = axios.create({ baseURL: '/api' });
const blank = { name: '', category: 'Logo', fileUrl: '', owner: '', status: 'Draft', description: '' };
const categories = ['Logo', 'Typography', 'Color Palette', 'Social Media', 'Presentation', 'Print', 'Guidelines', 'Other'];
const samples = [
  { id: 'sample-1', name: 'Primary Campus Logo', category: 'Logo', owner: 'Brand Team', status: 'Approved', description: 'Official logo for university-wide communication.', fileUrl: '' },
  { id: 'sample-2', name: 'Social Launch Kit', category: 'Social Media', owner: 'Marketing', status: 'In Review', description: 'Editable social templates for event announcements.', fileUrl: '' },
  { id: 'sample-3', name: 'Campus Color System', category: 'Color Palette', owner: 'Design Team', status: 'Approved', description: 'Core brand colors and usage notes.', fileUrl: '' },
  { id: 'sample-4', name: 'Presentation Template', category: 'Presentation', owner: 'Brand Team', status: 'Draft', description: 'Slides for official presentations.', fileUrl: '' }
];
const colors = ['#c7f36b', '#c4b5fd', '#93c5fd', '#fda4af', '#fdba74', '#5eead4'];

export default function Dashboard({ onLogout }) {
  const [assets, setAssets] = useState([]); const [stats, setStats] = useState({ total: 0, approved: 0, drafts: 0, categories: {} });
  const [query, setQuery] = useState(''); const [filter, setFilter] = useState('All assets'); const [modal, setModal] = useState(false); const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [mobileNav, setMobileNav] = useState(false);

  async function load() {
    setLoading(true); setError('');
    try { const [a, s] = await Promise.all([api.get('/assets'), api.get('/assets/stats')]); setAssets(a.data); setStats(s.data); }
    catch { setError('Could not connect to the backend. Start Spring Boot and check your MySQL settings.'); setAssets([]); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  useEffect(() => { if (notice) { const t = setTimeout(() => setNotice(''), 2800); return () => clearTimeout(t); } }, [notice]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter(a => (filter === 'All assets' || a.category === filter || a.status === filter) && (!q || [a.name, a.category, a.owner, a.description].some(v => (v || '').toLowerCase().includes(q))));
  }, [assets, query, filter]);
  const displayAssets = assets.length ? visible : (!loading && !error ? samples.filter(a => (filter === 'All assets' || a.category === filter || a.status === filter) && (!query || `${a.name} ${a.category} ${a.owner}`.toLowerCase().includes(query.toLowerCase()))) : []);

  function openAdd() { setForm(blank); setModal(true); }
  async function save(e) {
    e.preventDefault();
    try { await api.post('/assets', form); setModal(false); setNotice('Asset added to your library'); await load(); }
    catch { setNotice('Unable to save. Check the backend connection and required fields.'); }
  }
  async function remove(asset) {
    if (!window.confirm(`Delete “${asset.name}”?`)) return;
    try { await api.delete(`/assets/${asset.id}`); setNotice('Asset deleted'); await load(); }
    catch { setNotice('Could not delete this asset.'); }
  }
  const total = assets.length || (!loading && !error ? samples.length : 0);
  const approved = assets.length ? stats.approved : 2;
  const drafts = assets.length ? stats.drafts : 1;

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Aperture size={22}/></div><div><strong>campus<span>brand</span></strong><small>CREATIVE WORKSPACE</small></div><button className="mobile-close" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="nav-item active" onClick={() => { setFilter('All assets'); setMobileNav(false); }}><LayoutDashboard size={18}/> Overview</button>
      <button className="nav-item" onClick={() => { setFilter('All assets'); setMobileNav(false); }}><Images size={18}/> Asset library <span className="nav-count">{total}</span></button>
      <div className="workspace-label category-label">COLLECTIONS</div>
      {categories.slice(0, 6).map((c, i) => <button key={c} className={`nav-item category-nav ${filter === c ? 'selected' : ''}`} onClick={() => { setFilter(c); setMobileNav(false); }}><span className="category-dot" style={{ background: colors[i] }}/>{c}</button>)}
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Sparkles size={17}/></div><strong>Keep your brand consistent.</strong><p>One home for every campus creative asset.</p></div><div className="profile"><div className="avatar">CB</div><div className="profile-info"><strong>Brand Admin</strong><span>Workspace owner</span></div><span className="online-dot"/></div></div>
    </aside>

    <main className="main-content">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <b>Overview</b></div><div className="top-actions"><span className="status-indicator"><i/> Brand workspace</span><button className="secondary-btn logout-btn" onClick={onLogout}><LogOut size={15}/> Logout</button><div className="top-avatar">CB</div></div></header>
      <div className="page-wrap">
        <section className="welcome-row"><div><div className="eyebrow"><span/> YOUR BRAND, ORGANIZED</div><h1>Creative <em>control</em> center.</h1><p className="subtitle">Manage, organize, and share your campus brand assets — all in one place.</p></div><button className="primary-btn" onClick={openAdd}><Plus size={18}/> Add new asset</button></section>

        {error && <div className="error-banner">{error} <button onClick={load}>Retry</button></div>}
        {!assets.length && !loading && !error && <div className="demo-banner">Preview mode: sample assets are shown until you add assets to your database.</div>}

        <section className="stats-grid">
          <StatCard label="TOTAL ASSETS" value={total} note="Across your library" icon={<Images size={19}/>} tint="lime"/>
          <StatCard label="APPROVED ASSETS" value={approved} note="Ready to use" icon={<CheckCircle2 size={19}/>} tint="violet"/>
          <StatCard label="IN PROGRESS" value={drafts} note="Drafts to review" icon={<FileClock size={19}/>} tint="peach"/>
          <StatCard label="COLLECTIONS" value={Object.keys(stats.categories || {}).length || 6} note="Organized by type" icon={<Palette size={19}/>} tint="blue"/>
        </section>

        <section className="library-section"><div className="section-heading"><div><div className="eyebrow muted">THE LIBRARY</div><h2>Your brand assets <span className="asset-pill">{displayAssets.length}</span></h2><p>Everything your team needs to look and sound consistent.</p></div><button className="secondary-btn" onClick={load}>↻ <span>Refresh</span></button></div>
          <div className="toolbar"><div className="search-box"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search assets, collections, owners..."/><kbd>⌘ K</kbd></div><div className="filter-wrap"><span>Show:</span><select value={filter} onChange={e => setFilter(e.target.value)}><option>All assets</option>{categories.map(c => <option key={c}>{c}</option>)}<option>Approved</option><option>Draft</option><option>In Review</option></select></div></div>
          {loading ? <div className="empty-state"><div className="loader"/><p>Loading your creative library…</p></div> : displayAssets.length === 0 ? <div className="empty-state"><div className="empty-icon"><Images size={25}/></div><h3>No assets found</h3><p>Try another search or add your first brand asset.</p><button className="primary-btn small" onClick={openAdd}><Plus size={16}/> Add an asset</button></div> : <div className="asset-grid">{displayAssets.map((asset, i) => <AssetCard key={asset.id} asset={asset} index={i} onDelete={remove}/>)}</div>}
        </section>
        <footer><span>© 2026 Campus Brand</span><span>Made for consistent campus creativity <span className="footer-heart">✦</span></span></footer>
      </div>
    </main>

    {modal && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(false); }}><form className="modal" onSubmit={save}><div className="modal-head"><div><span className="eyebrow muted">NEW LIBRARY ITEM</span><h2>Add brand asset</h2></div><button type="button" className="icon-button" onClick={() => setModal(false)}><X size={20}/></button></div><label>Asset name *<input required maxLength="120" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Primary campus logo"/></label><div className="form-row"><label>Collection *<select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Status<select value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option>Draft</option><option>In Review</option><option>Approved</option></select></label></div><label>File URL<input value={form.fileUrl} onChange={e => setForm({...form, fileUrl: e.target.value})} placeholder="https://... or shared drive path"/></label><label>Owner / team<input value={form.owner} onChange={e => setForm({...form, owner: e.target.value})} placeholder="e.g. Marketing Team"/></label><label>Description<textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What is this asset used for?"/></label><div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setModal(false)}>Cancel</button><button type="submit" className="primary-btn"><Plus size={17}/> Save asset</button></div></form></div>}
    {notice && <div className="toast">{notice}</div>}
  </div>;
}
function StatCard({label, value, note, icon, tint}) { return <div className="stat-card"><div className={`stat-icon ${tint}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div><div className={`stat-orb ${tint}`}/></div>; }
function AssetCard({asset, index, onDelete}) {
  const iconColors = ['lime', 'violet', 'blue', 'peach']; const initials = (asset.name || 'A').split(' ').slice(0,2).map(s => s[0]).join('').toUpperCase();
  return <article className="asset-card"><div className={`asset-art art-${index % 4}`}><div className="art-grid"/><div className="art-initials">{initials}</div><div className="art-chip">{asset.category}</div><div className="art-spark"><Sparkles size={19}/></div></div><div className="asset-card-body"><div className="asset-title-row"><h3>{asset.name}</h3><button className="delete-btn" title="Delete asset" onClick={() => onDelete(asset)}><Trash2 size={16}/></button></div><p className="asset-desc">{asset.description || 'No description added yet.'}</p><div className="asset-meta"><span className="owner-avatar">{(asset.owner || 'CB').slice(0,2).toUpperCase()}</span><span className="owner-name">{asset.owner || 'Unassigned'}</span><span className={`status-badge ${(asset.status || 'Draft').toLowerCase().replace(' ', '-')}`}><i/>{asset.status || 'Draft'}</span></div>{asset.fileUrl && <a className="asset-link" href={asset.fileUrl} target="_blank" rel="noreferrer">Open asset <ExternalLink size={13}/></a>}</div></article>;
}
