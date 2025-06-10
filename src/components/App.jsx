import React, { useState, useEffect } from "react";

const MODULE_SHEET_ID = "13EBFBq7yfWr_ggaItD8Wu0cO260JS_h8FHwenZxDHJ0";
const MODULE_SHEET_NAME = "Sheet1";
const CONFIG_SHEET_NAME = "SchoolConfig";

function App() {
  const [schoolCode, setSchoolCode] = useState("SCH001");
  const [modules, setModules] = useState([]);
  const [config, setConfig] = useState(null);

  const fetchSheet = async (sheetName) => {
    const url = `https://docs.google.com/spreadsheets/d/${MODULE_SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
    const res = await fetch(url);
    const text = await res.text();
    return JSON.parse(text.substring(47).slice(0, -2));
  };

  useEffect(() => {
    fetchSheet(MODULE_SHEET_NAME).then((data) => {
      const rows = data.table.rows.map((r) => {
        const c = r.c;
        return {
          schoolCode: c[0]?.v,
          schoolName: c[1]?.v,
          moduleName: c[2]?.v,
          moduleURL: c[3]?.v,
          status: c[4]?.v,
          icon: c[5]?.v,
          description: c[6]?.v
        };
      });
      setModules(rows);
    });

    fetchSheet(CONFIG_SHEET_NAME).then((data) => {
      const rows = data.table.rows.map((r) => {
        const c = r.c;
        return {
          schoolCode: c[0]?.v,
          schoolName: c[1]?.v,
          themeStyle: c[2]?.v,
          themeColor: c[3]?.v,
          logoURL: c[4]?.v,
          totalStudents: c[5]?.v,
          attendancePercent: c[6]?.f,
          feeCollected: c[7]?.v
        };
      });
      const matched = rows.find((r) => r.schoolCode === schoolCode);
      setConfig(matched);
    });
  }, [schoolCode]);

  if (!config) return <div className="p-4 text-center">Loading...</div>;

  const themedCard = (module, i) => (
    <div key={i} className={`p-4 rounded-xl shadow ${module.status === "Coming Soon" ? "bg-gray-100 opacity-50" : "bg-white hover:shadow-lg"}`}>
      <div className="text-2xl mb-2">{module.icon || "📦"}</div>
      <h2 className="font-semibold text-lg">{module.moduleName}</h2>
      <p className="text-sm text-gray-500">{module.description}</p>
      {module.status === "Active" && module.moduleURL ? (
        <a href={module.moduleURL} target="_blank" className="inline-block mt-2 text-blue-600 underline">Open</a>
      ) : (
        <p className="text-red-400 mt-2">{module.status}</p>
      )}
    </div>
  );

  return (
    <div className="p-4" style={{ backgroundColor: "#f9fafb" }}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          {config.logoURL && <img src={config.logoURL} alt="Logo" className="h-10 rounded-full" />}
          <h1 className="text-xl font-bold text-gray-800">{config.schoolName} Dashboard</h1>
        </div>
        <select value={schoolCode} onChange={(e) => setSchoolCode(e.target.value)} className="p-2 border rounded">
          <option value="SCH001">SCH001</option>
          <option value="SCH002">SCH002</option>
          <option value="SCH003">SCH003</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
        <div className="bg-white shadow p-3 rounded-xl">👥 <strong>Total Students:</strong> {config.totalStudents}</div>
        <div className="bg-white shadow p-3 rounded-xl">📊 <strong>Attendance:</strong> {config.attendancePercent}</div>
        <div className="bg-white shadow p-3 rounded-xl">💰 <strong>Fee Collected:</strong> ₹{config.feeCollected}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {modules.filter((m) => m.schoolCode === schoolCode).map(themedCard)}
      </div>
    </div>
  );
}

export default App;
