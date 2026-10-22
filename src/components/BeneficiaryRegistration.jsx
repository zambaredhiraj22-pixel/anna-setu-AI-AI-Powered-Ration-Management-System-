
import { useEffect, useRef, useState } from 'react';
import {
  UserPlus,
  Search,
  Pencil,
  Trash2,
  Camera,
  X,
  Save,
  RefreshCw,
  Users,
  RotateCcw,
  VideoOff,
  ImagePlus,
} from 'lucide-react';

import beneficiaryService from '../services/beneficiaryService';
import './BeneficiaryRegistration.css';

const labels = {
  mr: {
    title: 'लाभार्थी नोंदणी',
    subtitle: 'रेशन कार्डधारकांची माहिती नोंदवा आणि व्यवस्थापित करा.',
    add: 'नवीन लाभार्थी',
    fullName: 'पूर्ण नाव',
    cardNumber: 'रेशन कार्ड क्रमांक',
    cardType: 'रेशन कार्डचा प्रकार',
    chooseType: 'कार्डचा प्रकार निवडा',
    yellow: 'अंत्योदय (AAY)',
    priority: 'प्राधान्य कुटुंब (PHH)',
    other: 'इतर',
    photo: 'लाभार्थ्याचा फोटो',
    choosePhoto: 'गॅलरीमधून फोटो निवडा',
    openCamera: 'कॅमेरा सुरू करा',
    takePhoto: 'फोटो काढा',
    retake: 'पुन्हा फोटो काढा',
    closeCamera: 'कॅमेरा बंद करा',
    cameraStarting: 'कॅमेरा सुरू होत आहे...',
    cameraError: 'कॅमेरा सुरू झाला नाही. परवानगी तपासा किंवा फोटो निवडा.',
    cameraUnsupported: 'या ब्राउझरमध्ये कॅमेरा उपलब्ध नाही.',
    cameraHint: 'फोटो काढण्यासाठी कॅमेऱ्याची परवानगी द्या.',
    photoCaptured: 'फोटो तयार आहे.',
    removePhoto: 'फोटो काढून टाका',
    save: 'जतन करा',
    update: 'बदल जतन करा',
    cancel: 'रद्द करा',
    search: 'नाव किंवा कार्ड क्रमांक शोधा...',
    list: 'नोंदणीकृत लाभार्थी',
    name: 'नाव',
    number: 'कार्ड क्रमांक',
    type: 'प्रकार',
    actions: 'कृती',
    edit: 'बदला',
    delete: 'हटवा',
    noData: 'लाभार्थी सापडले नाहीत.',
    loading: 'माहिती लोड होत आहे...',
    saved: 'लाभार्थ्याची नोंद जतन झाली.',
    updated: 'लाभार्थ्याची माहिती अपडेट झाली.',
    deleted: 'लाभार्थी हटवला.',
    deleteConfirm: 'हा लाभार्थी हटवायचा आहे का?',
    required: 'कृपया सर्व आवश्यक माहिती भरा.',
    loadError: 'लाभार्थ्यांची माहिती लोड झाली नाही.',
    photoError: 'कृपया 2 MB पेक्षा कमी आकाराचा फोटो निवडा.',
    loginError: 'नोंदणीसाठी आधी लॉगिन करून JWT token उपलब्ध करा.',
    genericError: 'काहीतरी चूक झाली. पुन्हा प्रयत्न करा.',
    refresh: 'पुन्हा लोड करा',
    total: 'एकूण लाभार्थी',
  },

  en: {
    title: 'Beneficiary Registration',
    subtitle: 'Register and manage ration card holders.',
    add: 'Add Beneficiary',
    fullName: 'Full Name',
    cardNumber: 'Ration Card Number',
    cardType: 'Ration Card Type',
    chooseType: 'Select card type',
    yellow: 'Antyodaya (AAY)',
    priority: 'Priority Household (PHH)',
    other: 'Other',
    photo: 'Beneficiary Photo',
    choosePhoto: 'Choose Photo from Gallery',
    openCamera: 'Open Camera',
    takePhoto: 'Take Photo',
    retake: 'Retake Photo',
    closeCamera: 'Close Camera',
    cameraStarting: 'Starting camera...',
    cameraError: 'Could not open camera. Check permission or choose a photo.',
    cameraUnsupported: 'Camera is not available in this browser.',
    cameraHint: 'Allow camera access to take a photo.',
    photoCaptured: 'Photo is ready.',
    removePhoto: 'Remove Photo',
    save: 'Save',
    update: 'Save Changes',
    cancel: 'Cancel',
    search: 'Search name or card number...',
    list: 'Registered Beneficiaries',
    name: 'Name',
    number: 'Card Number',
    type: 'Type',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    noData: 'No beneficiaries found.',
    loading: 'Loading beneficiaries...',
    saved: 'Beneficiary saved successfully.',
    updated: 'Beneficiary updated successfully.',
    deleted: 'Beneficiary deleted.',
    deleteConfirm: 'Do you want to delete this beneficiary?',
    required: 'Please fill in all required fields.',
    loadError: 'Could not load beneficiaries.',
    photoError: 'Please select a photo smaller than 2 MB.',
    loginError: 'Please log in and provide a JWT token first.',
    genericError: 'Something went wrong. Please try again.',
    refresh: 'Refresh',
    total: 'Total Beneficiaries',
  },

  hi: {
    title: 'लाभार्थी पंजीकरण',
    subtitle: 'राशन कार्ड धारकों की जानकारी दर्ज करें और प्रबंधित करें।',
    add: 'नया लाभार्थी',
    fullName: 'पूरा नाम',
    cardNumber: 'राशन कार्ड नंबर',
    cardType: 'राशन कार्ड का प्रकार',
    chooseType: 'कार्ड का प्रकार चुनें',
    yellow: 'अंत्योदय (AAY)',
    priority: 'प्राथमिकता परिवार (PHH)',
    other: 'अन्य',
    photo: 'लाभार्थी की फोटो',
    choosePhoto: 'गैलरी से फोटो चुनें',
    openCamera: 'कैमरा खोलें',
    takePhoto: 'फोटो लें',
    retake: 'फिर से फोटो लें',
    closeCamera: 'कैमरा बंद करें',
    cameraStarting: 'कैमरा शुरू हो रहा है...',
    cameraError: 'कैमरा नहीं खुला। अनुमति जाँचें या फोटो चुनें।',
    cameraUnsupported: 'इस ब्राउज़र में कैमरा उपलब्ध नहीं है।',
    cameraHint: 'फोटो लेने के लिए कैमरे की अनुमति दें।',
    photoCaptured: 'फोटो तैयार है।',
    removePhoto: 'फोटो हटाएँ',
    save: 'सहेजें',
    update: 'बदलाव सहेजें',
    cancel: 'रद्द करें',
    search: 'नाम या कार्ड नंबर खोजें...',
    list: 'पंजीकृत लाभार्थी',
    name: 'नाम',
    number: 'कार्ड नंबर',
    type: 'प्रकार',
    actions: 'कार्रवाई',
    edit: 'बदलें',
    delete: 'हटाएँ',
    noData: 'कोई लाभार्थी नहीं मिला।',
    loading: 'जानकारी लोड हो रही है...',
    saved: 'लाभार्थी की जानकारी सहेजी गई।',
    updated: 'लाभार्थी की जानकारी अपडेट हुई।',
    deleted: 'लाभार्थी हटा दिया गया।',
    deleteConfirm: 'क्या आप इस लाभार्थी को हटाना चाहते हैं?',
    required: 'कृपया सभी आवश्यक जानकारी भरें।',
    loadError: 'लाभार्थियों की जानकारी लोड नहीं हुई।',
    photoError: 'कृपया 2 MB से छोटी फोटो चुनें।',
    loginError: 'कृपया पहले लॉगिन करके JWT token उपलब्ध करें।',
    genericError: 'कुछ गलत हुआ। कृपया फिर से प्रयास करें।',
    refresh: 'फिर से लोड करें',
    total: 'कुल लाभार्थी',
  },
};

const emptyForm = {
  fullName: '',
  rationCardNumber: '',
  cardType: '',
  photoData: '',
};

function getErrorMessage(error, t) {
  if (error?.message?.includes('JWT token not found')) {
    return t.loginError;
  }

  return error?.message || t.genericError;
}

export default function BeneficiaryRegistration({ language = 'mr', role = 'USER' }) {
  const canManage = role === 'ADMIN';
  const t = labels[language] || labels.mr;

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
    setCameraStarting(false);
  }

  useEffect(() => {
    if (!cameraOpen || !streamRef.current || !videoRef.current) {
      return;
    }

    const video = videoRef.current;
    video.srcObject = streamRef.current;

    video.play().catch(() => {
      setError(t.cameraError);
    });
  }, [cameraOpen, t.cameraError]);

  useEffect(() => {
    loadBeneficiaries();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };

    // Load when this component first opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadBeneficiaries() {
    setLoading(true);
    setError('');

    try {
      const data = await beneficiaryService.getAll();
      setBeneficiaries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  }

  function openNewForm() {
    stopCamera();
    setForm({ ...emptyForm });
    setEditingId(null);
    setFormOpen(true);
    setMessage('');
    setError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function closeForm() {
    stopCamera();
    setForm({ ...emptyForm });
    setEditingId(null);
    setFormOpen(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function startCamera() {
    setError('');
    setMessage('');

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(t.cameraUnsupported);
      return;
    }

    stopCamera();
    setCameraStarting(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'user' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraOpen(true);
    } catch (err) {
      setError(
        err?.name === 'NotAllowedError' ||
          err?.name === 'PermissionDeniedError'
          ? t.cameraHint
          : t.cameraError
      );
    } finally {
      setCameraStarting(false);
    }
  }

  function takePhoto() {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      setError(t.cameraError);
      return;
    }

    const canvas = document.createElement('canvas');

    // Resize large camera images to reduce JSON request size.
    const maxWidth = 1280;
    const scale = Math.min(1, maxWidth / video.videoWidth);

    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);

    const context = canvas.getContext('2d');

    if (!context) {
      setError(t.genericError);
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoData = canvas.toDataURL('image/jpeg', 0.8);

    // Keep the photo below the existing 2 MB photo limit.
    const approximateSize = Math.ceil((photoData.length * 3) / 4);

    if (approximateSize > 2 * 1024 * 1024) {
      setError(t.photoError);
      return;
    }

    setForm((current) => ({
      ...current,
      photoData,
    }));

    setError('');
    setMessage(t.photoCaptured);
    stopCamera();
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setMessage('');

    if (!file.type.startsWith('image/')) {
      setError(t.photoError);
      event.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(t.photoError);
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((current) => ({
        ...current,
        photoData: String(reader.result || ''),
      }));
    };

    reader.onerror = () => {
      setError(t.genericError);
    };

    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setForm((current) => ({
      ...current,
      photoData: '',
    }));

    setMessage('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function startEdit(beneficiary) {
    stopCamera();

    setForm({
      fullName: beneficiary.fullName || '',
      rationCardNumber: beneficiary.rationCardNumber || '',
      cardType: beneficiary.cardType || '',
      photoData: beneficiary.photoData || '',
    });

    setEditingId(beneficiary.id);
    setFormOpen(true);
    setMessage('');
    setError('');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (
      !form.fullName.trim() ||
      !form.rationCardNumber.trim() ||
      !form.cardType
    ) {
      setError(t.required);
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      rationCardNumber: form.rationCardNumber.trim(),
      cardType: form.cardType,
      photoData: form.photoData || null,
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await beneficiaryService.update(editingId, payload);
        setMessage(t.updated);
      } else {
        await beneficiaryService.create(payload);
        setMessage(t.saved);
      }

      closeForm();
      await loadBeneficiaries();
    } catch (err) {
      setError(getErrorMessage(err, t));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(beneficiary) {
    if (!window.confirm(t.deleteConfirm)) return;

    setError('');
    setMessage('');

    try {
      await beneficiaryService.delete(beneficiary.id);
      setMessage(t.deleted);
      await loadBeneficiaries();
    } catch (err) {
      setError(getErrorMessage(err, t));
    }
  }

  const filteredBeneficiaries = beneficiaries.filter((item) => {
    const search = searchTerm.trim().toLowerCase();

    return (
      (item.fullName || '').toLowerCase().includes(search) ||
      (item.rationCardNumber || '').toLowerCase().includes(search)
    );
  });

  return (
    <div className="beneficiary-page">
      <div className="beneficiary-heading">
        <div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {canManage && (
          <button type="button" className="beneficiary-primary-button" onClick={openNewForm}>
            <UserPlus size={18} />
            {t.add}
          </button>
        )}
      </div>

      <div className="beneficiary-summary">
        <div className="beneficiary-summary-icon">
          <Users size={23} />
        </div>
        <div>
          <p>{t.total}</p>
          <strong>{beneficiaries.length}</strong>
        </div>
      </div>

      {message && (
        <div className="beneficiary-alert success" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="beneficiary-alert error" role="alert">
          {error}
        </div>
      )}

      {canManage && formOpen && (
        <form className="beneficiary-form" onSubmit={handleSubmit}>
          <div className="beneficiary-form-heading">
            <h2>{editingId !== null ? t.update : t.add}</h2>

            <button
              type="button"
              className="beneficiary-icon-button"
              onClick={closeForm}
              aria-label={t.cancel}
            >
              <X size={19} />
            </button>
          </div>

          <div className="beneficiary-form-grid">
            <label className="beneficiary-field">
              <span>{t.fullName} *</span>
              <input
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                maxLength={150}
                autoComplete="name"
                required
              />
            </label>

            <label className="beneficiary-field">
              <span>{t.cardNumber} *</span>
              <input
                name="rationCardNumber"
                type="text"
                value={form.rationCardNumber}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </label>

            <label className="beneficiary-field">
              <span>{t.cardType} *</span>
              <select
                name="cardType"
                value={form.cardType}
                onChange={handleChange}
                required
              >
                <option value="">{t.chooseType}</option>
                <option value="AAY">{t.yellow}</option>
                <option value="PHH">{t.priority}</option>
                <option value="OTHER">{t.other}</option>
              </select>
            </label>

            <div className="beneficiary-field">
              <span>{t.photo}</span>

              <div className="beneficiary-photo-actions">
                <button
                  type="button"
                  className="beneficiary-photo-button"
                  onClick={startCamera}
                  disabled={cameraStarting || saving}
                >
                  <Camera size={18} />
                  {cameraStarting ? t.cameraStarting : t.openCamera}
                </button>

                <button
                  type="button"
                  className="beneficiary-photo-button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving}
                >
                  <ImagePlus size={18} />
                  {t.choosePhoto}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="beneficiary-hidden-input"
                onChange={handlePhotoChange}
              />

              <small>{t.cameraHint} JPG, PNG किंवा WebP; कमाल 2 MB.</small>
            </div>
          </div>

          {cameraOpen && (
            <div className="beneficiary-camera-panel">
              <video
                ref={videoRef}
                className="beneficiary-camera-video"
                autoPlay
                muted
                playsInline
              />

              <div className="beneficiary-camera-actions">
                <button
                  type="button"
                  className="beneficiary-primary-button"
                  onClick={takePhoto}
                >
                  <Camera size={18} />
                  {t.takePhoto}
                </button>

                <button
                  type="button"
                  className="beneficiary-secondary-button"
                  onClick={stopCamera}
                >
                  <VideoOff size={18} />
                  {t.closeCamera}
                </button>
              </div>
            </div>
          )}

          {form.photoData && (
            <div className="beneficiary-photo-preview">
              <div>
                <img src={form.photoData} alt={t.photo} />
                <small>{t.photoCaptured}</small>
              </div>

              <div className="beneficiary-photo-preview-actions">
                <button
                  type="button"
                  className="beneficiary-photo-button"
                  onClick={startCamera}
                  disabled={cameraStarting || saving}
                >
                  <RotateCcw size={16} />
                  {t.retake}
                </button>

                <button
                  type="button"
                  className="beneficiary-icon-button"
                  onClick={removePhoto}
                  aria-label={t.removePhoto}
                  title={t.removePhoto}
                >
                  <X size={17} />
                </button>
              </div>
            </div>
          )}

          <div className="beneficiary-form-actions">
            <button
              type="button"
              className="beneficiary-secondary-button"
              onClick={closeForm}
              disabled={saving}
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              className="beneficiary-primary-button"
              disabled={saving || cameraOpen || cameraStarting}
            >
              <Save size={17} />
              {saving ? t.loading : editingId !== null ? t.update : t.save}
            </button>
          </div>
        </form>
      )}

      <div className="beneficiary-list-panel">
        <div className="beneficiary-list-heading">
          <h2>{t.list}</h2>

          <button
            type="button"
            className="beneficiary-refresh-button"
            onClick={loadBeneficiaries}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {t.refresh}
          </button>
        </div>

        <label className="beneficiary-search">
          <Search size={18} />
          <input
            type="search"
            placeholder={t.search}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        {loading ? (
          <p className="beneficiary-empty">{t.loading}</p>
        ) : filteredBeneficiaries.length === 0 ? (
          <p className="beneficiary-empty">{t.noData}</p>
        ) : (
          <div className="beneficiary-table-wrapper">
            <table className="beneficiary-table">
              <thead>
                <tr>
                  <th>{t.photo}</th>
                  <th>{t.name}</th>
                  <th>{t.number}</th>
                  <th>{t.type}</th>
                  {canManage && <th>{t.actions}</th>}
                </tr>
              </thead>

              <tbody>
                {filteredBeneficiaries.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.photoData ? (
                        <img
                          className="beneficiary-avatar"
                          src={item.photoData}
                          alt={item.fullName || t.name}
                        />
                      ) : (
                        <div className="beneficiary-avatar-placeholder">
                          <Users size={18} />
                        </div>
                      )}
                    </td>

                    <td>{item.fullName}</td>
                    <td>{item.rationCardNumber}</td>
                    <td>
                      <span className="beneficiary-type-badge">
                        {item.cardType}
                      </span>
                    </td>

                    {canManage && <td>
                      <div className="beneficiary-row-actions">
                        <button
                          type="button"
                          className="beneficiary-edit-button"
                          onClick={() => startEdit(item)}
                          aria-label={t.edit}
                          title={t.edit}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="beneficiary-delete-button"
                          onClick={() => handleDelete(item)}
                          aria-label={t.delete}
                          title={t.delete}
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
      </div>
    </div>
  );
}
