import { useState } from 'react';
import { Aperture, Eye, EyeOff, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import './Auth.css';

export default function Login({ onLogin, onRegister }) {
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (registering) {
      if (password.length < 6) return alert('Password must be at least 6 characters.');
      if (password !== confirm) return alert('Passwords do not match.');
    }
    setBusy(true);
    try {
      if (registering) {
        const ok = await onRegister({ name: name.trim(), email: email.trim(), password });
        if (ok) { setRegistering(false); setPassword(''); setConfirm(''); }
      } else {
        await onLogin({ email: email.trim(), password });
      }
    } finally { setBusy(false); }
  }

  function switchMode() {
    setRegistering(!registering); setName(''); setEmail(''); setPassword(''); setConfirm('');
  }

  return <div className="auth-page">
    <div className="auth-glow glow-a"/><div className="auth-glow glow-b"/>
    <nav className="auth-nav"><div className="auth-brand"><div className="auth-logo"><Aperture size={23}/></div><span>campus<strong>brand</strong></span></div><span className="auth-nav-note">CREATIVE WORKSPACE</span></nav>
    <main className="auth-main">
      <div className="auth-side-copy"><div className="auth-kicker"><Sparkles size={15}/> BUILT FOR CAMPUS CREATIVITY</div><h2>One home for<br/>your brand <em>assets.</em></h2><p>Keep every creative file organized, accessible, and consistent with your campus identity.</p><div className="auth-feature-list"><span><i/> One organized library</span><span><i/> Simple asset management</span><span><i/> Your team, on the same page</span></div></div>
      <section className="auth-card"><div className="auth-card-icon"><Aperture size={26}/></div><div className="auth-kicker">{registering ? 'JOIN CAMPUSBRAND' : 'YOUR CREATIVE SPACE'}</div><h1>{registering ? <>Create your <em>account.</em></> : <>Welcome <em>back.</em></>}</h1><p className="auth-description">{registering ? 'Create an account to start organizing your campus brand assets.' : 'Sign in to continue to your brand workspace.'}</p>
        <form onSubmit={submit}>
          {registering && <label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your full name" maxLength="100" autoComplete="name" required/></label>}
          <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" maxLength="150" required/></label>
          <label>Password<div className="auth-password"><input type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder={registering?'Create a password (6+ characters)':'Enter your password'} minLength={registering?6:undefined} autoComplete={registering?'new-password':'current-password'} required/><button type="button" onClick={()=>setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
          {registering && <label>Confirm password<input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Enter password again" minLength="6" autoComplete="new-password" required/></label>}
          <button className="auth-submit" type="submit" disabled={busy}>{busy?'Please wait…':registering?'Create account':'Sign in'} <ArrowRight size={17}/></button>
        </form>
        <div className="auth-switch-line"><span/>{registering?'ALREADY HAVE AN ACCOUNT?':'NEW TO CAMPUSBRAND?'}<span/></div>
        <button className="auth-switch" type="button" onClick={switchMode}>{registering?<><ArrowLeft size={15}/> Back to login</>:'Create an account'}</button>
        <p className="auth-footnote">YOUR CREATIVE WORKSPACE. YOUR BRAND. YOUR RULES.</p>
      </section>
    </main>
    <footer className="auth-footer"><span>© 2026 CAMPUS BRAND</span><span>MADE FOR CREATIVITY <b>✦</b></span></footer>
  </div>;
}
