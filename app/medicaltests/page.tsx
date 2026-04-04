"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MedicalTestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  async function fetchTests() {
    const { data, error } = await supabase
      .from('medicaltests')
      .select(`id, name, normalmin, normalmax, testcategories(name), uom(name)`);

    if (error) setErrorMsg(error.message);
    else setTests(data || []);
  }

  useEffect(() => {
    fetchTests();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this test?")) return;
    const { error } = await supabase.from('medicaltests').delete().eq('id', id);
    if (!error) fetchTests();
  }

  // --- NEW: EXCEL EXPORT FUNCTION ---
  const downloadExcel = () => {
    // 1. Create headers
    const headers = ["Test Name", "Category", "Unit", "Normal Min", "Normal Max"];
    
    // 2. Map data to rows
    const rows = tests.map(t => [
      t.name,
      t.testcategories?.name || 'N/A',
      t.uom?.name || 'N/A',
      t.normalmin,
      t.normalmax
    ]);

    // 3. Combine headers and rows into CSV format
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    // 4. Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "MedicalTests.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- NEW: PDF PRINT FUNCTION ---
  const printPDF = () => {
    window.print();
  };

  if (errorMsg) return <div className="p-10 text-red-500">Error: {errorMsg}</div>;

  return (
    <div className="p-10 font-sans max-w-6xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Medical Test Management</h1>
        
        {/* ACTION BUTTONS (Hidden during PDF print) */}
        <div className="flex gap-3 print:hidden">
          <button onClick={downloadExcel} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded hover:bg-emerald-700">
            Download Excel
          </button>
          <button onClick={printPDF} className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700">
            Print to PDF
          </button>
          <Link href="/medicaltests/add" className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            + Add New Test
          </Link>
        </div>
      </div>
      
      {/* TABLE SECTION */}
      <table className="w-full text-left border-collapse bg-white shadow-md">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="p-4">Test Name</th>
            <th className="p-4">Category</th>
            <th className="p-4">Unit</th>
            <th className="p-4">Range</th>
            {/* Hide the Actions column header during PDF print */}
            <th className="p-4 text-center print:hidden">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests?.map((test: any) => (
            <tr key={test.id} className="border-b hover:bg-slate-50">
              <td className="p-4 font-semibold">{test.name}</td>
              <td className="p-4 text-blue-600">{test.testcategories?.name || 'N/A'}</td>
              <td className="p-4">{test.uom?.name || 'N/A'}</td>
              <td className="p-4 font-mono">{test.normalmin} — {test.normalmax}</td>
              
              {/* Hide the Edit/Delete buttons during PDF print */}
              <td className="p-4 flex justify-center gap-3 print:hidden">
                <Link href={`/medicaltests/edit/${test.id}`} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Edit
                </Link>
                <button onClick={() => handleDelete(test.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}