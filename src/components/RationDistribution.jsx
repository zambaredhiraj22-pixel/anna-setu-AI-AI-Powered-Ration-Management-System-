
import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const translations = {
  en: {
    title: "Ration Distribution",
    subtitle: "Distribute available ration and view distribution history",
    form: "Distribute Ration",
    history: "Distribution History",
    beneficiary: "Beneficiary",
    stock: "Available Stock",
    quantity: "Quantity to Distribute",
    date: "Distribution Date",
    item: "Item",
    unit: "Unit",
    actions: "Actions",
    chooseBeneficiary: "Select beneficiary",
    chooseStock: "Select stock",
    submit: "Confirm Distribution",
    loading: "Loading data...",
    empty: "No distribution records found.",
    success: "Ration distributed successfully.",
    error: "Something went wrong.",
    refresh: "Refresh",
    available: "Available",
  },
  mr: {
    title: "रेशन वितरण",
    subtitle: "रेशन वितरित करा आणि वितरणाचा इतिहास पहा",
    form: "रेशन वितरित करा",
    history: "वितरणाचा इतिहास",
    beneficiary: "लाभार्थी",
    stock: "उपलब्ध साठा",
    quantity: "वितरित करायचे प्रमाण",
    date: "वितरण तारीख",
    item: "वस्तू",
    unit: "एकक",
    actions: "कृती",
    chooseBeneficiary: "लाभार्थी निवडा",
    chooseStock: "साठा निवडा",
    submit: "वितरण निश्चित करा",
    loading: "माहिती लोड होत आहे...",
    empty: "वितरणाची नोंद उपलब्ध नाही.",
    success: "रेशन यशस्वीपणे वितरित झाले.",
    error: "काहीतरी चूक झाली.",
    refresh: "रिफ्रेश",
    available: "उपलब्ध",
  },
  hi: {
    title: "राशन वितरण",
    subtitle: "राशन वितरित करें और वितरण इतिहास देखें",
    form: "राशन वितरित करें",
    history: "वितरण इतिहास",
    beneficiary: "लाभार्थी",
    stock: "उपलब्ध स्टॉक",
    quantity: "वितरित की जाने वाली मात्रा",
    date: "वितरण तारीख",
    item: "वस्तु",
    unit: "इकाई",
    actions: "कार्रवाई",
    chooseBeneficiary: "लाभार्थी चुनें",
    chooseStock: "स्टॉक चुनें",
    submit: "वितरण की पुष्टि करें",
    loading: "जानकारी लोड हो रही है...",
    empty: "कोई वितरण रिकॉर्ड नहीं मिला।",
    success: "राशन सफलतापूर्वक वितरित हुआ।",
    error: "कुछ गलत हुआ।",
    refresh: "रिफ्रेश",
    available: "उपलब्ध",
  },
};

const styles = {
  page: { padding: 24, color: "#172033" },
  heading: { fontSize: 28, marginBottom: 6 },
  subtitle: { marginTop: 0, color: "#64748b" },
  panel: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 20,
    marginBottom: 22,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 16,
    alignItems: "end",
  },
  label: {
    display: "block",
    fontWeight: 600,
    fontSize: 14,
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
    padding: "11px 15px",
    border: 0,
    borderRadius: 8,
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondary: {
    padding: "9px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    background: "#fff",
    cursor: "pointer",
  },
  message: { padding: 12, borderRadius: 8, marginBottom: 16 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", minWidth: 750, borderCollapse: "collapse" },
  cell: {
    padding: "13px 12px",
    textAlign: "left",
    borderBottom: "1px solid #e2e8f0",
  },
};

function getBeneficiaryName(item) {
  return item.fullName || item.beneficiaryName || `Beneficiary ${item.id}`;
}

function getStockName(item) {
  return (
    item.commodityName ||
    item.itemName ||
    `Commodity ${item.commodityId ?? item.id}`
  );
}

export default function RationDistribution({ language = "en", token, role = "USER" }) {
  const canManage = ["ADMIN", "OFFICER"].includes(role);
  const t = translations[language] || translations.en;

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [distributions, setDistributions] = useState([]);

  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [stockId, setStockId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [beneficiaryData, stockData, distributionData] =
        await Promise.all([
          apiRequest("/beneficiaries", {}, token),
          apiRequest("/stocks", {}, token),
          apiRequest("/distributions", {}, token),
        ]);

      setBeneficiaries(
        Array.isArray(beneficiaryData) ? beneficiaryData : []
      );
      setStocks(Array.isArray(stockData) ? stockData : []);
      setDistributions(
        Array.isArray(distributionData) ? distributionData : []
      );
    } catch (err) {
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  }, [token, t.error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectedStock = stocks.find(
    (item) => String(item.id) === String(stockId)
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!beneficiaryId || !stockId) {
      setError("Please select a beneficiary and stock.");
      return;
    }

    if (!quantity || !Number.isFinite(Number(quantity)) || Number(quantity) <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    if (
      selectedStock &&
      Number(quantity) > Number(selectedStock.availableQuantity)
    ) {
      setError(
        `Only ${selectedStock.availableQuantity} ${selectedStock.unit || ""} is available.`
      );
      return;
    }

    setSaving(true);

    try {
      const body = {
        beneficiaryId: Number(beneficiaryId),
        stockId: Number(stockId),
        quantityDistributed: Number(quantity),
      };

      await apiRequest(
        "/distributions",
        {
          method: "POST",
          body: JSON.stringify(body),
        },
        token
      );

      setNotice(t.success);
      setBeneficiaryId("");
      setStockId("");
      setQuantity("");

      await loadData();
    } catch (err) {
      setError(err.message || t.error);
    } finally {
      setSaving(false);
    }
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString(
      language === "mr" ? "mr-IN" : language === "hi" ? "hi-IN" : "en-IN"
    );
  }

  return (
    <div style={styles.page}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
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
        <h2 style={{ fontSize: 20, marginTop: 0 }}>{t.form}</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>{t.beneficiary}</label>
              <select
                style={styles.input}
                value={beneficiaryId}
                onChange={(e) => setBeneficiaryId(e.target.value)}
                required
              >
                <option value="">{t.chooseBeneficiary}</option>
                {beneficiaries.map((item) => (
                  <option key={item.id} value={item.id}>
                    {getBeneficiaryName(item)}
                    {item.rationCardNumber
                      ? ` — ${item.rationCardNumber}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>{t.stock}</label>
              <select
                style={styles.input}
                value={stockId}
                onChange={(e) => setStockId(e.target.value)}
                required
              >
                <option value="">{t.chooseStock}</option>
                {stocks.map((item) => (
                  <option key={item.id} value={item.id}>
                    {getStockName(item)} — {t.available}:{" "}
                    {item.availableQuantity} {item.unit || ""}
                  </option>
                ))}
              </select>

              {selectedStock && (
                <small style={{ display: "block", marginTop: 6, color: "#64748b" }}>
                  {t.available}: {selectedStock.availableQuantity}{" "}
                  {selectedStock.unit || ""}
                </small>
              )}
            </div>

            <div>
              <label style={styles.label}>{t.quantity}</label>
              <input
                style={styles.input}
                type="number"
                min="0.01"
                step="0.01"
                max={selectedStock?.availableQuantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div>
              <button
                type="submit"
                style={styles.button}
                disabled={saving || loading}
              >
                {saving ? "..." : t.submit}
              </button>
            </div>
          </div>
        </form>
      </section>}

      <section style={styles.panel}>
        <h2 style={{ fontSize: 20, marginTop: 0 }}>{t.history}</h2>

        {loading ? (
          <p>{t.loading}</p>
        ) : distributions.length === 0 ? (
          <p>{t.empty}</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[
                    "ID",
                    t.beneficiary,
                    t.item,
                    t.quantity,
                    t.unit,
                    t.date,
                  ].map((heading) => (
                    <th key={heading} style={styles.cell}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {distributions.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.cell}>{item.id}</td>
                    <td style={styles.cell}>
                      {item.beneficiaryName ||
                        `Beneficiary ${item.beneficiaryId}`}
                    </td>
                    <td style={styles.cell}>{item.itemName || "—"}</td>
                    <td style={styles.cell}>{item.quantityDistributed}</td>
                    <td style={styles.cell}>{item.unit || "—"}</td>
                    <td style={styles.cell}>
                      {formatDate(item.distributionDate)}
                    </td>
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
