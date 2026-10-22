import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  ClipboardList,
  BrainCircuit,
  Menu,
  X,
  Languages,
  ArrowRight,
  Home,
  LogIn,
  UserPlus,
  LogOut,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';

import { translations, languageOptions } from './i18n';
import BeneficiaryRegistration from './components/BeneficiaryRegistration';
import CommodityManagement from './components/CommodityManagement';
import StockManagement from './components/StockManagement';
import RationDistribution from './components/RationDistribution';
import AIForecast from './components/AIForecast';
import './App.css';

const API_BASE = 'http://localhost:8080/api';

const menuItems = [
  { key: 'dashboard', icon: LayoutDashboard },
  { key: 'beneficiaries', icon: Users },
  { key: 'commodities', icon: Boxes },
  { key: 'stock', icon: Package },
  { key: 'distribution', icon: ClipboardList },
  { key: 'forecast', icon: BrainCircuit },
];

const languageNames = {
  mr: 'मराठी',
  en: 'English',
  hi: 'हिंदी',
};

const extraTranslations = {
  mr: {
    home: 'मुख्यपृष्ठ',
    modules: 'उपलब्ध सुविधा',
    moduleDescription: 'काम सुरू करण्यासाठी खालील सुविधा निवडा.',
    welcome: 'AnnaSetu AI मध्ये आपले स्वागत आहे!',
    welcomeText: 'लाभार्थी, धान्य साठा आणि रेशन वितरणाची माहिती येथे व्यवस्थापित करा.',
    open: 'उघडा',
    admin: 'वापरकर्ता',
    language: 'भाषा बदला',
    back: 'डॅशबोर्डवर परत जा',
    comingSoon: 'ही सुविधा पुढील टप्प्यात सुरू केली जाईल.',
    footer: 'गावातील प्रत्येकासाठी सोपी प्रणाली',
    loginTitle: 'लॉगिन करा',
    registerTitle: 'नवीन खाते तयार करा',
    loginHint: 'तुमच्या खात्यात प्रवेश करण्यासाठी माहिती भरा.',
    registerHint: 'AnnaSetu AI वापरण्यासाठी नवीन खाते तयार करा.',
    username: 'वापरकर्ता नाव',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड पुन्हा टाका',
    login: 'लॉगिन',
    register: 'नोंदणी करा',
    noAccount: 'खाते नाही?',
    haveAccount: 'आधीपासून खाते आहे?',
    createAccount: 'नवीन खाते तयार करा',
    goLogin: 'लॉगिन करा',
    loggingIn: 'लॉगिन होत आहे...',
    registering: 'नोंदणी होत आहे...',
    logout: 'लॉगआउट',
    loginSuccess: 'लॉगिन यशस्वी झाले.',
    registerSuccess: 'नोंदणी यशस्वी झाली. आता लॉगिन करा.',
    passwordMismatch: 'दोन्ही पासवर्ड सारखे नाहीत.',
    fillFields: 'कृपया सर्व माहिती भरा.',
    genericError: 'काहीतरी चूक झाली. पुन्हा प्रयत्न करा.',
    chooseLanguage: 'तुमची भाषा निवडा',
    languageHint: 'तुम्हाला समजणारी भाषा निवडा.',
  },
  en: {
    home: 'Home',
    modules: 'Available Modules',
    moduleDescription: 'Choose a module below to get started.',
    welcome: 'Welcome to AnnaSetu AI!',
    welcomeText: 'Manage beneficiaries, grain stock and ration distribution in one place.',
    open: 'Open',
    admin: 'User',
    language: 'Change language',
    back: 'Back to Dashboard',
    comingSoon: 'This module will be implemented in a later step.',
    footer: 'A simple system for every village',
    loginTitle: 'Sign in',
    registerTitle: 'Create an account',
    loginHint: 'Enter your account details to continue.',
    registerHint: 'Create an account to use AnnaSetu AI.',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm password',
    login: 'Login',
    register: 'Register',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    createAccount: 'Create account',
    goLogin: 'Sign in',
    loggingIn: 'Signing in...',
    registering: 'Registering...',
    logout: 'Logout',
    loginSuccess: 'Login successful.',
    registerSuccess: 'Registration successful. Please sign in.',
    passwordMismatch: 'Passwords do not match.',
    fillFields: 'Please fill in all required fields.',
    genericError: 'Something went wrong. Please try again.',
    chooseLanguage: 'Choose your language',
    languageHint: 'Select the language you understand.',
  },
  hi: {
    home: 'मुख्य पृष्ठ',
    modules: 'उपलब्ध सुविधाएँ',
    moduleDescription: 'शुरू करने के लिए नीचे दी गई सुविधा चुनें।',
    welcome: 'AnnaSetu AI में आपका स्वागत है!',
    welcomeText: 'लाभार्थियों, अनाज के स्टॉक और राशन वितरण का प्रबंधन करें।',
    open: 'खोलें',
    admin: 'उपयोगकर्ता',
    language: 'भाषा बदलें',
    back: 'डैशबोर्ड पर वापस जाएँ',
    comingSoon: 'यह सुविधा अगले चरण में तैयार की जाएगी।',
    footer: 'हर गाँव के लिए एक आसान प्रणाली',
    loginTitle: 'लॉगिन करें',
    registerTitle: 'नया खाता बनाएँ',
    loginHint: 'आगे बढ़ने के लिए अपने खाते की जानकारी भरें।',
    registerHint: 'AnnaSetu AI का उपयोग करने के लिए खाता बनाएँ।',
    username: 'उपयोगकर्ता नाम',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड फिर से दर्ज करें',
    login: 'लॉगिन',
    register: 'पंजीकरण करें',
    noAccount: 'खाता नहीं है?',
    haveAccount: 'पहले से खाता है?',
    createAccount: 'नया खाता बनाएँ',
    goLogin: 'लॉगिन करें',
    loggingIn: 'लॉगिन हो रहा है...',
    registering: 'पंजीकरण हो रहा है...',
    logout: 'लॉगआउट',
    loginSuccess: 'लॉगिन सफल हुआ।',
    registerSuccess: 'पंजीकरण सफल हुआ। अब लॉगिन करें।',
    passwordMismatch: 'दोनों पासवर्ड मेल नहीं खाते।',
    fillFields: 'कृपया सभी आवश्यक जानकारी भरें।',
    genericError: 'कुछ गलत हुआ। कृपया फिर से प्रयास करें।',
    chooseLanguage: 'अपनी भाषा चुनें',
    languageHint: 'वह भाषा चुनें जिसे आप समझते हैं।',
  },
};


function getRoleFromToken(jwt) {
  try {
    const payloadPart = jwt?.split('.')[1];
    if (!payloadPart) return 'USER';
    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(normalized));
    const role = String(payload.role || 'USER').replace(/^ROLE_/, '').toUpperCase();
    return ['ADMIN', 'OFFICER', 'USER'].includes(role) ? role : 'USER';
  } catch {
    return 'USER';
  }
}

const roleLabels = {
  mr: { ADMIN: 'प्रशासक', OFFICER: 'अधिकारी', USER: 'वापरकर्ता' },
  en: { ADMIN: 'Admin', OFFICER: 'Officer', USER: 'User' },
  hi: { ADMIN: 'प्रशासक', OFFICER: 'अधिकारी', USER: 'उपयोगकर्ता' },
};

function getAllowedMenu(role) {
  const permissions = {
    ADMIN: ['dashboard', 'beneficiaries', 'commodities', 'stock', 'distribution', 'forecast'],
    OFFICER: ['dashboard', 'beneficiaries', 'commodities', 'stock', 'distribution', 'forecast'],
    USER: ['dashboard', 'commodities', 'stock', 'forecast'],
  };
  return permissions[role] || permissions.USER;
}

export default function App() {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('ration-language') || ''
  );

  const [token, setToken] = useState(
    () => localStorage.getItem('ration-token') || ''
  );

  const [username, setUsername] = useState(
    () => localStorage.getItem('ration-username') || ''
  );

  const [role, setRole] = useState(() => getRoleFromToken(localStorage.getItem('ration-token') || ''));

  const [authMode, setAuthMode] = useState('login');
  const [formUsername, setFormUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');

  const [activePage, setActivePage] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  const t = translations[language] || translations.mr;
  const extra = extraTranslations[language] || extraTranslations.mr;

  function selectLanguage(code) {
    localStorage.setItem('ration-language', code);
    setLanguage(code);
  }

  function changePage(key) {
    setActivePage(key);
    setMenuOpen(false);
  }

  function showMessage(text, type = 'error') {
    setMessage(text);
    setMessageType(type);
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setMessage('');

    if (!formUsername.trim() || !password) {
      showMessage(extra.fillFields);
      return;
    }

    if (authMode === 'register' && password !== confirmPassword) {
      showMessage(extra.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        authMode === 'login'
          ? `${API_BASE}/auth/login`
          : `${API_BASE}/auth/register`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain',
        },
        body: JSON.stringify({
          username: formUsername.trim(),
          password,
        }),
      });

      const responseText = await response.text();

      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = { message: responseText };
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          (typeof data === 'string' ? data : '') ||
          `Request failed (${response.status})`
        );
      }

      if (authMode === 'register') {
        setAuthMode('login');
        setPassword('');
        setConfirmPassword('');
        showMessage(extra.registerSuccess, 'success');
        return;
      }

      if (!data.token) {
        throw new Error(
          'Login response did not contain a JWT token. Check AuthResponse.'
        );
      }

      localStorage.setItem('ration-token', data.token);

      localStorage.setItem(
        'ration-username',
        data.username || formUsername.trim()
      );

      setToken(data.token);
      const loggedInRole = getRoleFromToken(data.token);
      localStorage.setItem('ration-role', loggedInRole);
      setRole(loggedInRole);
      setUsername(data.username || formUsername.trim());
      setPassword('');
      setConfirmPassword('');
      setActivePage('dashboard');
      showMessage(extra.loginSuccess, 'success');
    } catch (error) {
      showMessage(error.message || extra.genericError, 'error');
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('ration-token');
    localStorage.removeItem('ration-username');
    localStorage.removeItem('ration-role');

    setToken('');
    setRole('USER');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setFormUsername('');
    setAuthMode('login');
    setActivePage('dashboard');
    setMenuOpen(false);
    setMessage('');
  }

  if (!language) {
    return (
      <div className="language-screen">
        <div className="language-card">
          <div className="language-logo">
            <Boxes size={42} strokeWidth={2.2} />
          </div>

          <h1>AnnaSetu AI</h1>
          <p className="language-subtitle">
            AI Using Ration Management System
          </p>

          <h2>{extra.chooseLanguage}</h2>
          <p className="language-hint">{extra.languageHint}</p>

          <div className="language-options">
            {languageOptions.map((item) => (
              <button
                type="button"
                key={item.code}
                className="language-option"
                onClick={() => selectLanguage(item.code)}
              >
                <span className="language-flag">{item.flag}</span>
                <span className="language-name">
                  {languageNames[item.code] || item.native}
                </span>
                <ArrowRight size={21} />
              </button>
            ))}
          </div>

          <p className="language-footer">{extra.footer}</p>
        </div>
      </div>
    );
  }

  if (!token) {
    const isLogin = authMode === 'login';

    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-brand-icon">
            <Boxes size={36} />
          </div>

          <h1>AnnaSetu AI</h1>
          <p className="auth-subtitle">
            AI Using Ration Management System
          </p>

          <div className="auth-language">
            <Languages size={17} />
            <select
              aria-label={extra.language}
              value={language}
              onChange={(event) => selectLanguage(event.target.value)}
            >
              {languageOptions.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.native}
                </option>
              ))}
            </select>
          </div>

          <div className="auth-heading-icon">
            {isLogin ? <LogIn size={24} /> : <UserPlus size={24} />}
          </div>

          <h2>{isLogin ? extra.loginTitle : extra.registerTitle}</h2>
          <p className="auth-description">
            {isLogin ? extra.loginHint : extra.registerHint}
          </p>

          {message && (
            <div className={`auth-message ${messageType}`} role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="auth-form">
            <label className="auth-field">
              <span>{extra.username}</span>
              <input
                type="text"
                autoComplete="username"
                value={formUsername}
                onChange={(event) => setFormUsername(event.target.value)}
                placeholder={extra.username}
                required
              />
            </label>

            <label className="auth-field">
              <span>{extra.password}</span>
              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={
                    isLogin ? 'current-password' : 'new-password'
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={extra.password}
                  required
                />

                <button
                  type="button"
                  className="auth-show-password"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label="Show or hide password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {!isLogin && (
              <label className="auth-field">
                <span>{extra.confirmPassword}</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder={extra.confirmPassword}
                  required
                />
              </label>
            )}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading
                ? isLogin
                  ? extra.loggingIn
                  : extra.registering
                : isLogin
                  ? extra.login
                  : extra.register}

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-switch">
            <span>{isLogin ? extra.noAccount : extra.haveAccount}</span>

            <button
              type="button"
              onClick={() => {
                setAuthMode(isLogin ? 'register' : 'login');
                setMessage('');
                setPassword('');
                setConfirmPassword('');
              }}
            >
              {isLogin ? extra.createAccount : extra.goLogin}
            </button>
          </div>

          <p className="auth-security">
            <ShieldCheck size={16} />
            {extra.footer}
          </p>
        </div>
      </div>
    );
  }

  const allowedMenuKeys = getAllowedMenu(role);
  const visibleMenuItems = menuItems.filter((item) => allowedMenuKeys.includes(item.key));
  const currentMenu = menuItems.find((item) => item.key === activePage);
  const CurrentIcon = currentMenu?.icon || Home;

  return (
    <div className="app">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="logo">
          <div className="logo-icon">
            <Boxes size={26} />
          </div>

          <div className="logo-text">
            <h2>AnnaSetu AI</h2>
            <p>AI Using Ration Management System</p>
          </div>

          <button
            type="button"
            className="close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <p className="menu-title">{t.menu}</p>

        <nav className="navigation">
          {visibleMenuItems.map(({ key, icon: Icon }) => (
            <button
              type="button"
              key={key}
              className={`menu-item ${
                activePage === key ? 'selected' : ''
              }`}
              onClick={() => changePage(key)}
            >
              <Icon size={19} />
              <span>{t[key]}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="footer-icon">
            <Languages size={19} />
          </div>
          <span>{extra.footer}</span>
        </div>
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="overlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="main">
        <header className="header">
          <button
            type="button"
            className="mobile-menu"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="header-title">
            <span>{extra.home}</span>
            <span className="header-divider">/</span>
            <strong>{t[activePage] || activePage}</strong>
          </div>

          <div className="header-actions">
            <label className="language-select-label">
              <Languages size={17} />

              <select
                aria-label={extra.language}
                value={language}
                onChange={(event) => selectLanguage(event.target.value)}
              >
                {languageOptions.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.native}
                  </option>
                ))}
              </select>
            </label>

            <span className="admin-label">
              {username || extra.admin}
            </span>
            <span className={`role-badge role-${role.toLowerCase()}`} title="Account role">
              {roleLabels[language]?.[role] || role}
            </span>

            <button
              type="button"
              className="logout-button"
              onClick={logout}
              title={extra.logout}
              aria-label={extra.logout}
            >
              <LogOut size={17} />
              <span>{extra.logout}</span>
            </button>
          </div>
        </header>

        <section className="page">
          {activePage === 'dashboard' ? (
            <>
              <div className="welcome">
                <div className="welcome-content">
                  <p className="eyebrow">
                    AI Using Ration Management System
                  </p>

                  <h1>{extra.welcome}</h1>

                  <p className="welcome-description">
                    {extra.welcomeText}
                  </p>
                </div>

                <div className="welcome-icon">
                  <Boxes size={38} />
                </div>
              </div>

              <div className="section-heading-row">
                <h2>{extra.modules}</h2>
                <p>{extra.moduleDescription}</p>
              </div>

              <div className="module-grid">
                {visibleMenuItems
                  .filter((item) => item.key !== 'dashboard')
                  .map(({ key, icon: Icon }) => (
                    <button
                      type="button"
                      className="module-card"
                      key={key}
                      onClick={() => changePage(key)}
                    >
                      <div className="module-icon">
                        <Icon size={25} />
                      </div>

                      <h3>{t[key] || extra[key] || key}</h3>
                      <p>{extra.moduleDescription}</p>

                      <span className="open-link">
                        {extra.open}
                        <ArrowRight size={16} />
                      </span>
                    </button>
                  ))}
              </div>
            </>
          ) : activePage === 'beneficiaries' ? (
            <BeneficiaryRegistration
              language={language}
              token={token}
              role={role}
            />
          ) : activePage === 'commodities' ? (
            <CommodityManagement
              language={language}
              token={token}
              role={role}
            />
          ) : activePage === 'stock' ? (
            <StockManagement
              language={language}
              token={token}
              role={role}
            />
          ) : activePage === 'distribution' ? (
            <RationDistribution
              language={language}
              token={token}
              role={role}
            />
          ) : activePage === 'forecast' ? (
            <AIForecast language={language} token={token} role={role} />
          ) : (
            <div className="module-page">
              <div className="module-page-icon">
                <CurrentIcon size={29} />
              </div>

              <h1>{t[activePage] || activePage}</h1>
              <p>{extra.comingSoon}</p>

              <button
                type="button"
                className="primary-button"
                onClick={() => changePage('dashboard')}
              >
                <Home size={17} />
                {extra.back}
              </button>
            </div>
          )}
        </section>

        <footer className="app-footer">
          <span>© {new Date().getFullYear()} AnnaSetu AI</span>
          <span>{extra.footer}</span>
        </footer>
      </main>
    </div>
  );
}