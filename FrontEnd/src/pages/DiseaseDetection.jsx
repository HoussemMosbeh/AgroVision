import { useState } from "react";
import axios from "axios";

function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", image);
      const res = await axios.post("http://localhost:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError("Prediction failed. Check that the CNN service is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Disease Detection</h1>

      <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} />

      {preview && (
        <div style={{ margin: "1rem 0" }}>
          <img src={preview} alt="preview" style={{ width: "100%", borderRadius: "8px" }} />
        </div>
      )}

      <button onClick={handleSubmit} disabled={!image || loading} style={{ marginTop: "1rem" }}>
        {loading ? "Analyzing..." : "Detect Disease"}
      </button>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Result</h2>
          <p><strong>Disease:</strong> {result.disease}</p>
          <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
          <h3>Top 5</h3>
          <ul>
            {Object.entries(result.top5).map(([label, prob]) => (
              <li key={label}>{label}: {(prob * 100).toFixed(2)}%</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DiseaseDetection;