import { useState, useCallback } from "react";

const InsuranceForm = () => {
  const [formData, setFormData] = useState({
    age: "",
    bmi: "",
    children: "",
    sex: "male",
    smoker: "no",
    region: "northwest",
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setPrediction(data.prediction);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="insurance-card">
      <h1 className="insurance-title">Insurance Cost Predictor</h1>

      <form className="insurance-form" onSubmit={handleSubmit}>
        {/* Age */}
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        {/* Sex */}
        <div className="form-group">
          <label htmlFor="sex">Sex</label>
          <select
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* BMI */}
        <div className="form-group">
          <label htmlFor="bmi">BMI</label>
          <input
            type="number"
            id="bmi"
            name="bmi"
            placeholder="Enter BMI"
            value={formData.bmi}
            onChange={handleChange}
            required
          />
        </div>

        {/* Children */}
        <div className="form-group">
          <label htmlFor="children">Children</label>
          <input
            type="number"
            id="children"
            name="children"
            placeholder="Number of children"
            value={formData.children}
            onChange={handleChange}
            required
          />
        </div>

        {/* Smoker */}
        <div className="form-group">
          <label htmlFor="smoker">Smoker</label>
          <select
            id="smoker"
            name="smoker"
            value={formData.smoker}
            onChange={handleChange}
            required
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {/* Region */}
        <div className="form-group">
          <label htmlFor="region">Region</label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
          >
            <option value="northeast">Northeast</option>
            <option value="northwest">Northwest</option>
            <option value="southeast">Southeast</option>
            <option value="southwest">Southwest</option>
          </select>
        </div>

        <button
          type="submit"
          className={`predict-btn ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Calculating..." : "Predict Cost"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {prediction && (
        <p className="prediction-text">
          Estimated Cost: <strong>${Math.round(prediction)}</strong>
        </p>
      )}
    </div>
  );
};

export default InsuranceForm;
