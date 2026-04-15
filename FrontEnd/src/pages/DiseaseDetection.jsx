import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "./DiseaseDetection.css";

function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [terrains, setTerrains] = useState([]);
  const [selectedTerrain, setSelectedTerrain] = useState("");
  const [plantes, setPlantes] = useState([]);
  const [selectedPlante, setSelectedPlante] = useState("");

  useEffect(() => {
    axiosInstance.get("/fields").then((res) => setTerrains(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedTerrain) { setPlantes([]); setSelectedPlante(""); return; }
    axiosInstance.get(`/fields/${selectedTerrain}/plantes`)
      .then((res) => {
        setPlantes(res.data);
        setSelectedPlante(res.data.length > 0 ? res.data[0].plante?.id : "");
      })
      .catch(() => { setPlantes([]); setSelectedPlante(""); });
  }, [selectedTerrain]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!image || !selectedTerrain) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("terrainId", selectedTerrain);
      if (selectedPlante) formData.append("planteId", selectedPlante);
      const res = await axiosInstance.post("/detections", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data || err.message || "Prediction failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dd-page">
      <div className="dd-hero">
        <div className="dd-hero__accent" />
        <h1 className="dd-hero__title">Disease Detection</h1>
        <p className="dd-hero__sub">CNN · EfficientNet-B0 · Plant Health</p>
      </div>

      {error && <div className="dd-alert dd-alert--err">{error}</div>}

      <div className="dd-section">
        <div className="dd-block">
          <div className="dd-block__header">
            <span className="dd-block__num">01</span>
            <div>
              <h2 className="dd-block__title">Select Field</h2>
              <p className="dd-block__desc">Detection will be linked to this field and its crop</p>
            </div>
          </div>
          <div className="dd-form-grid">
            <div className="dd-field">
              <label className="dd-label">Field</label>
              <select
                className="dd-select"
                value={selectedTerrain}
                onChange={(e) => setSelectedTerrain(e.target.value)}
                required
              >
                <option value="">-- Select Field --</option>
                {terrains.map((t) => (
                  <option key={t.id} value={t.id}>{t.nom}</option>
                ))}
              </select>
            </div>

            <div className="dd-field">
              <label className="dd-label">Crop (auto-detected)</label>
              {plantes.length > 0 ? (
                <select
                  className="dd-select"
                  value={selectedPlante}
                  onChange={(e) => setSelectedPlante(e.target.value)}
                >
                  {plantes.map((tp) => (
                    <option key={tp.plante?.id} value={tp.plante?.id}>
                      {tp.plante?.nomPlante}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="dd-plante-info">
                  {selectedTerrain
                    ? <span className="dd-muted">No crop associated with this field</span>
                    : <span className="dd-muted">Select a field first</span>
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dd-block">
          <div className="dd-block__header">
            <span className="dd-block__num">02</span>
            <div>
              <h2 className="dd-block__title">Upload Image</h2>
              <p className="dd-block__desc">JPEG or PNG of the plant leaf</p>
            </div>
          </div>

          <label className="dd-upload-area">
            <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} />
            <div className="dd-upload-icon">↑</div>
            <p className="dd-upload-text">{image ? image.name : "Click to upload image"}</p>
            <p className="dd-upload-hint">JPEG, PNG supported</p>
          </label>

          {preview && (
            <div className="dd-preview">
              <img src={preview} alt="preview" />
            </div>
          )}
        </div>

        <div className="dd-actions">
          <button
            className="dd-btn dd-btn--primary"
            onClick={handleSubmit}
            disabled={!image || !selectedTerrain || loading}
          >
            {loading ? "Analyzing..." : "Detect Disease"}
          </button>
        </div>

        {result && (
          <div className="dd-result">
            <h2 className="dd-result__title">Detection Result</h2>
            <div className="dd-result__grid">
              <div className="dd-result__card">
                <p className="dd-result__card-label">Predicted Class</p>
                <p className="dd-result__card-value">{result.predictedClass}</p>
              </div>
              <div className="dd-result__card">
                <p className="dd-result__card-label">Confidence</p>
                <p className="dd-result__card-value">{(result.confidence * 100).toFixed(2)}%</p>
              </div>
              <div className={`dd-result__card ${result.isHealthy ? "dd-result__card--healthy" : "dd-result__card--unhealthy"}`}>
                <p className="dd-result__card-label">Status</p>
                <p className="dd-result__card-value">{result.isHealthy ? "Healthy" : "Diseased"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiseaseDetection;