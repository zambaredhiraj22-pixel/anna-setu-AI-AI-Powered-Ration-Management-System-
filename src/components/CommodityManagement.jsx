
import { useEffect, useMemo, useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
  Boxes,
} from 'lucide-react';

import commodityService from '../services/commodityService';
import './CommodityManagement.css';

const labels = {
  mr: {
    title: 'वस्तू व्यवस्थापन',
    subtitle: 'रेशनमध्ये उपलब्ध वस्तू आणि त्यांचा साठा व्यवस्थापित करा.',
    add: 'नवीन वस्तू',
    edit: 'वस्तू बदला',
    name: 'वस्तूचे नाव',
    quantity: 'उपलब्ध प्रमाण',
    unit: 'एकक',
    chooseUnit: 'एकक निवडा',
    kg: 'किलोग्रॅम (KG)',
    litre: 'लिटर (L)',
    packet: 'पॅकेट',
    piece: 'नग',
    save: 'जतन करा',
    update: 'बदल जतन करा',
    cancel: 'रद्द करा',
    search: 'वस्तूचे नाव शोधा...',
    list: 'उपलब्ध वस्तू',
    actions: 'कृती',
    delete: 'हटवा',
    noData: 'वस्तू सापडल्या नाहीत.',
    loading: 'माहिती लोड होत आहे...',
    total: 'एकूण वस्तू',
    saved: 'वस्तू यशस्वीपणे जतन झाली.',
    updated: 'वस्तूची माहिती अपडेट झाली.',
    deleted: 'वस्तू हटवली.',
    required: 'कृपया सर्व आवश्यक माहिती भरा.',
    deleteConfirm: 'ही वस्तू हटवायची आहे का?',
    loadError: 'वस्तूंची माहिती लोड झाली नाही.',
    refresh: 'पुन्हा लोड करा',
    genericError: 'काहीतरी चूक झाली. पुन्हा प्रयत्न करा.',
    loginError: 'कृपया आधी लॉगिन करा.',
    invalidQuantity: 'प्रमाण शून्य किंवा त्यापेक्षा जास्त असावे.',
  },
  en: {
    title: 'Commodity Management',
    subtitle: 'Manage ration commodities and their available quantities.',
    add: 'Add Commodity',
    edit: 'Edit Commodity',
    name: 'Commodity Name',
    quantity: 'Available Quantity',
    unit: 'Unit',
    chooseUnit: 'Select unit',
    kg: 'Kilograms (KG)',
    litre: 'Litres (L)',
    packet: 'Packet',
    piece: 'Pieces',
    save: 'Save',
    update: 'Save Changes',
    cancel: 'Cancel',
    search: 'Search commodity name...',
    list: 'Available Commodities',
    actions: 'Actions',
    delete: 'Delete',
    noData: 'No commodities found.',
    loading: 'Loading commodities...',
    total: 'Total Commodities',
    saved: 'Commodity saved successfully.',
    updated: 'Commodity updated successfully.',
    deleted: 'Commodity deleted.',
    required: 'Please fill in all required fields.',
    deleteConfirm: 'Do you want to delete this commodity?',
    loadError: 'Could not load commodities.',
    refresh: 'Refresh',
    genericError: 'Something went wrong. Please try again.',
    loginError: 'Please log in first.',
    invalidQuantity: 'Quantity must be zero or greater.',
  },
  hi: {
    title: 'वस्तु प्रबंधन',
    subtitle: 'राशन की वस्तुओं और उपलब्ध मात्रा का प्रबंधन करें।',
    add: 'नई वस्तु',
    edit: 'वस्तु बदलें',
    name: 'वस्तु का नाम',
    quantity: 'उपलब्ध मात्रा',
    unit: 'इकाई',
    chooseUnit: 'इकाई चुनें',
    kg: 'किलोग्राम (KG)',
    litre: 'लीटर (L)',
    packet: 'पैकेट',
    piece: 'नग',
    save: 'सहेजें',
    update: 'बदलाव सहेजें',
    cancel: 'रद्द करें',
    search: 'वस्तु का नाम खोजें...',
    list: 'उपलब्ध वस्तुएँ',
    actions: 'कार्रवाई',
    delete: 'हटाएँ',
    noData: 'कोई वस्तु नहीं मिली।',
    loading: 'जानकारी लोड हो रही है...',
    total: 'कुल वस्तुएँ',
    saved: 'वस्तु सफलतापूर्वक सहेजी गई।',
    updated: 'वस्तु की जानकारी अपडेट हुई।',
    deleted: 'वस्तु हटा दी गई।',
    required: 'कृपया सभी आवश्यक जानकारी भरें।',
    deleteConfirm: 'क्या आप इस वस्तु को हटाना चाहते हैं?',
    loadError: 'वस्तुओं की जानकारी लोड नहीं हुई।',
    refresh: 'फिर से लोड करें',
    genericError: 'कुछ गलत हुआ। कृपया फिर प्रयास करें।',
    loginError: 'कृपया पहले लॉगिन करें।',
    invalidQuantity: 'मात्रा शून्य या उससे अधिक होनी चाहिए।',
  },
};

const emptyForm = {
  name: '',
  quantityAvailable: '0',
  unit: '',
};

function getErrorMessage(error, t) {
  if (error?.message?.includes('JWT token not found')) {
    return t.loginError;
  }

  return error?.message || t.genericError;
}

export default function CommodityManagement({ language = 'mr', role = 'USER' }) {
  const canManage = ['ADMIN', 'OFFICER'].includes(role);
  const t = labels[language] || labels.mr;

  const [commodities, setCommodities] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadCommodities() {
    setLoading(true);
    setError('');

    try {
      const data = await commodityService.getAll();
      setCommodities(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCommodities();
    // Initial load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openNewForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setFormOpen(true);
    setMessage('');
    setError('');
  }

  function closeForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setFormOpen(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function startEdit(item) {
    setForm({
      name: item.name || '',
      quantityAvailable: String(item.quantityAvailable ?? 0),
      unit: item.unit || '',
    });

    setEditingId(item.id);
    setFormOpen(true);
    setMessage('');
    setError('');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    const name = form.name.trim();
    const quantity = Number(form.quantityAvailable);

    if (!name || !form.unit) {
      setError(t.required);
      return;
    }

    if (
      form.quantityAvailable.trim() === '' ||
      !Number.isFinite(quantity) ||
      quantity < 0
    ) {
      setError(t.invalidQuantity);
      return;
    }

    const payload = {
      name,
      quantityAvailable: quantity,
      unit: form.unit,
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await commodityService.update(editingId, payload);
        setMessage(t.updated);
      } else {
        await commodityService.create(payload);
        setMessage(t.saved);
      }

      closeForm();
      await loadCommodities();
    } catch (err) {
      setError(getErrorMessage(err, t));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(t.deleteConfirm)) return;

    setMessage('');
    setError('');

    try {
      await commodityService.delete(item.id);
      setMessage(t.deleted);
      await loadCommodities();
    } catch (err) {
      setError(getErrorMessage(err, t));
    }
  }

  const filteredCommodities = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return commodities.filter((item) =>
      (item.name || '').toLowerCase().includes(search)
    );
  }, [commodities, searchTerm]);

  return (
    <main className="commodity-page">
      <header className="commodity-heading">
        <div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {canManage && (
          <button type="button" className="commodity-primary-button" onClick={openNewForm}>
            <Plus size={18} />
            {t.add}
          </button>
        )}
      </header>

      <section className="commodity-summary">
        <div className="commodity-summary-icon">
          <Boxes size={24} />
        </div>
        <div>
          <p>{t.total}</p>
          <strong>{commodities.length}</strong>
        </div>
      </section>

      {message && (
        <div className="commodity-alert success" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="commodity-alert error" role="alert">
          {error}
        </div>
      )}

      {canManage && formOpen && (
        <form className="commodity-form" onSubmit={handleSubmit}>
          <div className="commodity-form-heading">
            <h2>{editingId !== null ? t.edit : t.add}</h2>

            <button
              type="button"
              className="commodity-icon-button"
              onClick={closeForm}
              aria-label={t.cancel}
            >
              <X size={19} />
            </button>
          </div>

          <div className="commodity-form-grid">
            <label className="commodity-field">
              <span>{t.name} *</span>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                maxLength={150}
                required
              />
            </label>

            <label className="commodity-field">
              <span>{t.quantity} *</span>
              <input
                name="quantityAvailable"
                type="number"
                min="0"
                step="any"
                value={form.quantityAvailable}
                onChange={handleChange}
                required
              />
            </label>

            <label className="commodity-field">
              <span>{t.unit} *</span>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                required
              >
                <option value="">{t.chooseUnit}</option>
                <option value="KG">KG</option>
                <option value="L">{t.litre}</option>
                <option value="PACKET">{t.packet}</option>
                <option value="PIECE">{t.piece}</option>
              </select>
            </label>
          </div>

          <div className="commodity-form-actions">
            <button
              type="button"
              className="commodity-secondary-button"
              onClick={closeForm}
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              className="commodity-primary-button"
              disabled={saving}
            >
              <Save size={17} />
              {saving ? t.loading : editingId !== null ? t.update : t.save}
            </button>
          </div>
        </form>
      )}

      <section className="commodity-list-panel">
        <div className="commodity-list-heading">
          <h2>{t.list}</h2>

          <button
            type="button"
            className="commodity-refresh-button"
            onClick={loadCommodities}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {t.refresh}
          </button>
        </div>

        <label className="commodity-search">
          <Search size={18} />
          <input
            type="search"
            placeholder={t.search}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        {loading ? (
          <p className="commodity-empty">{t.loading}</p>
        ) : filteredCommodities.length === 0 ? (
          <p className="commodity-empty">{t.noData}</p>
        ) : (
          <div className="commodity-table-wrapper">
            <table className="commodity-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t.name}</th>
                  <th>{t.quantity}</th>
                  <th>{t.unit}</th>
                  {canManage && <th>{t.actions}</th>}
                </tr>
              </thead>

              <tbody>
                {filteredCommodities.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <span className="commodity-name-cell">
                        <Package size={17} />
                        {item.name}
                      </span>
                    </td>
                    <td>{item.quantityAvailable ?? 0}</td>
                    <td>
                      <span className="commodity-unit-badge">
                        {item.unit}
                      </span>
                    </td>
                    {canManage && <td>
                      <div className="commodity-row-actions">
                        <button
                          type="button"
                          className="commodity-edit-button"
                          onClick={() => startEdit(item)}
                          title={t.edit}
                          aria-label={t.edit}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="commodity-delete-button"
                          onClick={() => handleDelete(item)}
                          title={t.delete}
                          aria-label={t.delete}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
