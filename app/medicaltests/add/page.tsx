"use client";
import { useState } from "react";
// Since we are one folder deeper now, we use three sets of dots to go up!
import { supabase } from "../../../lib/supabase"; 
import { useRouter } from "next/navigation";

export default function AddMedicalTest() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [normalmin, setNormalmin] = useState("");
  const [normalmax, setNormalmax] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); // Stops the page from refreshing

    // Insert the new test into Supabase
    // Note: We are hardcoding category 1 and uom 1 just to make it simple for the assignment
    const { error } = await supabase.from("medicaltests").insert([
      { 
        name: name, 
        normalmin: Number(normalmin), 
        normalmax: Number(normalmax),
        idcategory: 1, 
        iduom: 1 
      }
    ]);

    if (error) {
      alert("Error saving: " + error.message);
    } else {
      alert("Test added successfully!");
      router.push("/medicaltests"); // Send the user back to the table
    }
  }

  return (
    <div className="p-10 max-w-lg mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-6">Add New Medical Test</h1>
      
      <form onSubmit={handleSave} className="flex flex-col gap-4 bg-white p-6 shadow-md rounded border">
        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700">Test Name</label>
          <input 
            required
            type="text" 
            className="w-full border p-2 rounded text-black" 
            placeholder="e.g., Fasting Blood Sugar"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold mb-1 text-gray-700">Normal Min</label>
            <input 
              required
              type="number" 
              className="w-full border p-2 rounded text-black" 
              placeholder="0"
              value={normalmin}
              onChange={(e) => setNormalmin(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold mb-1 text-gray-700">Normal Max</label>
            <input 
              required
              type="number" 
              className="w-full border p-2 rounded text-black" 
              placeholder="100"
              value={normalmax}
              onChange={(e) => setNormalmax(e.target.value)}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mt-4"
        >
          Save Test
        </button>
      </form>
    </div>
  );
}