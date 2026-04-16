import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "./YieldPrediction.css";

function PredictionPage() {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState("");

  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load fields
  useEffect(() => {
    axiosInstance
      .get("/fields")
      .then((res) => setFields(res.data))
      .catch(() => setFields([]));
  }, []);

  // Load crops when field changes
  useEffect(() => {
    if (!selectedField) {
      setCrops([]);
      setSelectedCrop("");
      return;
    }

    axiosInstance
      .get(`/fields/${selectedField}/plantes`)
      .then((res) => {
        setCrops(res.data);
        setSelectedCrop(res.data.length > 0 ? res.data[0].plante?.id : "");
      })
      .catch(() => {
        setCrops([]);
        setSelectedCrop("");
      });
  }, [selectedField]);

  // RUN MODEL
  const handleSubmit = async () => {
  if (!selectedField) return;
  setLoading(true);
  setError(null);
  setResult(null);
  try {
    const res = await axiosInstance.post(`/predictions/terrain/${selectedField}`);
    setResult(res.data);
  } catch (err) {
    setError(
      err.response?.data?.message || err.response?.data || err.message || "Prediction failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="pp-page">
      <div className="pp-hero">
        <h1 className="pp-title">Smart Prediction</h1>
        <p className="pp-sub">AI Model · Yield & Quality Analysis</p>
      </div>

      {error && <div className="pp-error">{error}</div>}

      <div className="pp-card">
  <div className="pp-block__header">
    <span className="pp-block__num">01</span>
    <div>
      <h2 className="pp-block__title">Select Field & Crop</h2>
      <p className="pp-block__desc">Prediction will use the latest soil metrics for this field</p>
    </div>
  </div>

  <div className="pp-form-grid">
    <div className="pp-field">
      <label className="pp-label">Field</label>
      <select
        className="pp-select"
        value={selectedField}
        onChange={(e) => setSelectedField(e.target.value)}
        required
      >
        <option value="">-- Select Field --</option>
        {fields.map((f) => (
          <option key={f.id} value={f.id}>{f.nom}</option>
        ))}
      </select>
    </div>

    <div className="pp-field">
      <label className="pp-label">Crop (auto-detected)</label>
      {crops.length > 0 ? (
        <select
          className="pp-select"
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
        >
          {crops.map((c) => (
            <option key={c.plante?.id} value={c.plante?.id}>{c.plante?.nomPlante}</option>
          ))}
        </select>
      ) : (
        <div className="pp-crop-info">
          {selectedField
            ? <span className="pp-muted">No crop associated with this field</span>
            : <span className="pp-muted">Select a field first</span>
          }
        </div>
      )}
    </div>
  </div>

  <div className="pp-actions">
    <button
      className="pp-btn"
      onClick={handleSubmit}
      disabled={!selectedField || !selectedCrop || loading}
    >
      {loading ? "Running Model..." : "Run Prediction"}
    </button>
  </div>
</div>

      {/* RESULT */}
{result && (
  <div className="pp-result">
    <div className="pp-result-header">
      <h2>Prediction Result</h2>
      <span className={`pp-quality-badge pp-quality-${result.quality}`}>
        {result.quality === "high" ? "Good Harvest" : result.quality === "medium" ? "Average Harvest" : "Poor Harvest"}
      </span>
    </div>

    <div className="pp-yield-hero">
      <span className="pp-yield-label">Expected Yield</span>
      <span className="pp-yield-value">{result.yieldTons}</span>
      <span className="pp-yield-unit">tons / hectare</span>
    </div>

    <div className="pp-result-grid">
      <div className="pp-box">
        <span className="pp-box-icon">🌡</span>
        <span className="pp-box-label">Avg Temperature</span>
        <strong>{result.avgTemp}°C</strong>
      </div>
      <div className="pp-box">
        <span className="pp-box-icon">🌧</span>
        <span className="pp-box-label">Rainfall</span>
        <strong>{result.totalRain} mm</strong>
      </div>
      <div className="pp-box">
        <span className="pp-box-icon">💧</span>
        <span className="pp-box-label">Humidity</span>
        <strong>{result.avgHumidity}%</strong>
      </div>
      <div className="pp-box">
        <span className="pp-box-icon">☀</span>
        <span className="pp-box-label">Solar Radiation</span>
        <strong>{result.avgRadiation} MJ/m²</strong>
      </div>
    </div>

    <div className="pp-quality-bar-section">
      <p className="pp-quality-bar-title">Quality Probability</p>
      <div className="pp-quality-bar-row">
        <span>High</span>
        <div className="pp-bar-track">
          <div className="pp-bar-fill pp-bar-high" style={{ width: `${(result.qualityProbaHigh * 100).toFixed(0)}%` }} />
        </div>
        <span>{(result.qualityProbaHigh * 100).toFixed(0)}%</span>
      </div>
      <div className="pp-quality-bar-row">
        <span>Medium</span>
        <div className="pp-bar-track">
          <div className="pp-bar-fill pp-bar-medium" style={{ width: `${(result.qualityProbaMedium * 100).toFixed(0)}%` }} />
        </div>
        <span>{(result.qualityProbaMedium * 100).toFixed(0)}%</span>
      </div>
      <div className="pp-quality-bar-row">
        <span>Low</span>
        <div className="pp-bar-track">
          <div className="pp-bar-fill pp-bar-low" style={{ width: `${(result.qualityProbaLow * 100).toFixed(0)}%` }} />
        </div>
        <span>{(result.qualityProbaLow * 100).toFixed(0)}%</span>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default PredictionPage;