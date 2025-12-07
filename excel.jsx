import { useState } from "react";
import * as XLSX from "xlsx";

export default function ExcelUpload() {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      // FIX: Read ALL rows (even blank ones)
      const jsonData = XLSX.utils.sheet_to_json(sheet, {
        defval: "",      // show empty cells
        raw: false,
        blankrows: true, // read rows even if blank
      });

      setData(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-10 border border-gray-200">

        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-6">
          Excel Upload & Display
        </h1>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-400 rounded-xl p-6 cursor-pointer hover:bg-purple-50 transition">
          <span className="text-lg font-medium text-purple-700">
            Click to Upload Excel File
          </span>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
        </label>

        {data.length > 0 && (
          <div className="mt-8 max-h-96 overflow-y-scroll overflow-x-auto border border-purple-300 rounded-xl shadow-lg">
            <table className="w-full border-collapse">
              <thead className="bg-purple-600 text-white sticky top-0">
                <tr>
                  {Object.keys(data[0]).map((key, index) => (
                    <th key={index} className="py-3 px-4 text-left font-semibold border-b border-purple-400">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="bg-white even:bg-purple-50 hover:bg-purple-100 transition"
                  >
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex} className="py-2 px-4 border-b border-gray-200">
                        {value}
                      </td>
                    ))}
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
