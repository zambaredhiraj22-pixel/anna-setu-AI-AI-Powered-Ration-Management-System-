
import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const translations = {
  en: {
    title: "Stock Management",
    subtitle: "Manage available ration inventory",
    add: "Add Stock",
    update: "Update Stock",
    commodity: "Commodity",
    quantity: "Available Quantity",
    unit: "Unit",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save Stock",
    loading: "Loading stock...",
    empty: "No stock records found.",
    choose: "Select commodity",
    confirm: "Are you sure you want to delete this stock?",
    successAdd: "Stock added successfully.",
    successUpdate: "Stock updated successfully.",
    successDelete: "Stock deleted successfully.",
    error: "Something went wrong.",
    refresh: "Refresh",
  },
  mr: {
    title: "साठा व्यवस्थापन",
    subtitle: "रेशनचा उपलब्ध साठा व्यवस्थापित करा",
    add: "साठा जोडा",
    update: "साठा अपडेट करा",
    commodity: "वस्तू",
    quantity: "उपलब्ध प्रमाण",
    unit: "एकक",
    actions: "कृती",
    edit: "बदल",
    delete: "डिलीट",
    cancel: "रद्द करा",
    save: "साठा सेव्ह करा",
    loading: "साठा लोड होत आहे...",
    empty: "साठ्याची नोंद उपलब्ध नाही.",
    choose: "वस्तू निवडा",
    confirm: "हा साठा डिलीट करायचा आहे का?",
    successAdd: "साठा यशस्वीपणे जोडला.",
    successUpdate: "साठा यशस्वीपणे अपडेट झाला.",
    successDelete: "साठा यशस्वीपणे डिलीट झाला.",
    error: "काहीतरी चूक झाली.",
    refresh: "रिफ्रेश",
  },
  hi: {
    title: "स्टॉक प्रबंधन",
    subtitle: "उपलब्ध राशन स्टॉक प्रबंधित करें",
    add: "स्टॉक जोड़ें",
    update: "स्टॉक अपडेट करें",
    commodity: "वस्तु",
    quantity: "उपलब्ध मात्रा",
    unit: "इकाई",
    actions: "कार्रवाई",
    edit: "एडिट",
    delete: "डिलीट",
    cancel: "रद्द करें",
    save: "स्टॉक सेव करें",
    loading: "स्टॉक लोड हो रहा है...",
    empty: "कोई स्टॉक रिकॉर्ड नहीं मिला।",
    choose: "वस्तु चुनें",
    confirm: "क्या आप यह स्टॉक डिलीट करना चाहते हैं?",
    successAdd: "स्टॉक सफलतापूर्वक जोड़ा गया।",
    successUpdate: "स्टॉक सफलतापूर्वक अपडेट हुआ।",
    successDelete: "स्टॉक सफलतापूर्वक डिलीट हुआ।",
    error: "कुछ गलत हुआ।",
    refresh: "रिफ्रेश",
  },
};

const styles = {
  page: { padding: 24, color: "#172033" },
  heading: { marginBottom: 6, fontSize: 28 },
  subtitle: { color: "#64748b", marginTop: 0 },
  panel: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 20,
    marginBottom: 22,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 16,
    alignItems: "end",
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 7,
  },
  input: {
    boxSizing: "border-box",
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    background: "#fff",
    fontSize: 14,
  },
  button: {
    border: 0,
    borderRadius: 8,
    padding: "11px 15px",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondary: {
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    padding: "9px 12px",
    background: "#fff",
    cursor: "pointer",
  },
  danger: {
    border: 0,
    borderRadius: 7,
    padding: "8px 10px",
    background: "#fee2e2",
    color: "#b91c1c",
    cursor: "pointer",
  },
  tableWrap: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 600,
  },
  cell: {
    padding: "13px 12px",
    borderBottom: "1px solid #e2e8f0",
    textAlign: "left",
  },
  message: { padding: 12, borderRadius: 8, marginBottom: 16 },
};

function getCommodityId(item) {
  return item.commodityId ?? item.id;
}

function getCommodityName(item) {
  return (
    item.commodityName ??
    item.name ??
    item.itemName ??
    `Commodity ${getCommodityId(item)}`
  );
}

export default function StockManagement({ language = "en", token, role = "USER" }) {
  const canManage = ["ADMIN", "OFFICER"].includes(role);
  const t = translations[language] || translations.en;

  const [stocks, setStocks] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [commodityId, setCommodityId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [stockData, commodityData] = await Promise.all([
        apiRequest("/stocks", {}, token),
        apiRequest("/commodities", {}, token),
      ]);

      setStocks(Array.isArray(stockData) ? stockData : []);
      setCommodities(Array.isArray(commodityData) ? commodityData : []);
    } catch (err) {
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  }, [token, t.error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function resetForm() {
    setCommodityId("");
    setQuantity("");
    setEditingId(null);
  }

  function startEdit(stock) {
    setEditingId(stock.id);
    setCommodityId(String(stock.commodityId));
    setQuantity(String(stock.availableQuantity ?? ""));
    setNotice("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!commodityId || quantity === "" || Number(quantity) < 0) {
      setError("Select a commodity and enter a valid quantity.");
      return;
    }

    setSaving(true);

    try {
      const body = {
        commodityId: Number(commodityId),
        availableQuantity: Number(quantity),
      };

      if (editingId !== null) {
        await apiRequest(
          `/stocks/${editingId}`,
          { method: "PUT", body: JSON.stringify(body) },
          token
        );
        setNotice(t.successUpdate);
      } else {
        await apiRequest(
          "/stocks",
          { method: "POST", body: JSON.stringify(body) },
          token
        );
        setNotice(t.successAdd);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message || t.error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t.confirm)) return;

    setError("");
    setNotice("");

    try {
      await apiRequest(`/stocks/${id}`, { method: "DELETE" }, token);
      setNotice(t.successDelete);

      if (editingId === id) resetForm();

      await loadData();
    } catch (err) {
      setError(err.message || t.error);
    }
  }

  return (
    <div style={styles.page}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={styles.heading}>{t.title}</h1>
          <p style={styles.subtitle}>{t.subtitle}</p>
        </div>
        <button style={styles.secondary} onClick={loadData}>
          ↻ {t.refresh}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            ...styles.message,
            background: "#fee2e2",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          style={{
            ...styles.message,
            background: "#dcfce7",
            color: "#166534",
          }}
        >
          {notice}
        </div>
      )}

      {canManage && <section style={styles.panel}>
        <h2 style={{ marginTop: 0, fontSize: 20 }}>
          {editingId !== null ? t.update : t.add}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>{t.commodity}</label>
              <select
                style={styles.input}
                value={commodityId}
                onChange={(e) => setCommodityId(e.target.value)}
                required
              >
                <option value="">{t.choose}</option>
                {commodities.map((item) => (
                  <option
                    key={getCommodityId(item)}
                    value={getCommodityId(item)}
                  >
                    {getCommodityName(item)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>{t.quantity}</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button style={styles.button} type="submit" disabled={saving}>
                {saving ? "..." : t.save}
              </button>

              {editingId !== null && (
                <button
                  style={styles.secondary}
                  type="button"
                  onClick={resetForm}
                >
                  {t.cancel}
                </button>
              )}
            </div>
          </div>
        </form>
      </section>}

      <section style={styles.panel}>
        <h2 style={{ marginTop: 0, fontSize: 20 }}>{t.title}</h2>

        {loading ? (
          <p>{t.loading}</p>
        ) : stocks.length === 0 ? (
          <p>{t.empty}</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[ "ID", t.commodity, t.quantity, t.unit, ...(canManage ? [t.actions] : []) ].map(
                    (heading) => (
                      <th key={heading} style={styles.cell}>
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.id}>
                    <td style={styles.cell}>{stock.id}</td>
                    <td style={styles.cell}>
                      {stock.commodityName || `Commodity ${stock.commodityId}`}
                    </td>
                    <td style={styles.cell}>{stock.availableQuantity}</td>
                    <td style={styles.cell}>{stock.unit || "—"}</td>
                    {canManage && <td style={styles.cell}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button style={styles.secondary} onClick={() => startEdit(stock)}>{t.edit}</button>
                        <button style={styles.danger} onClick={() => handleDelete(stock.id)}>{t.delete}</button>
                      </div>
                    </td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
