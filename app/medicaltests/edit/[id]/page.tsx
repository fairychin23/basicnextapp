"use client";

import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { useRouter, useParams } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function EditMedicalTest() {
  const router = useRouter();
  const params = useParams();
  const id = params.id; 

  const [name, setName] = useState("");
  const [normalmin, setNormalmin] = useState("");
  const [normalmax, setNormalmax] = useState("");

  useEffect(() => {
    if (!id) return;
    async function loadTest() {
      const { data } = await supabase.from("medicaltests").select("*").eq("id", id).single();
      if (data) {
        setName(data.name);
        setNormalmin(data.normalmin.toString());
        setNormalmax(data.normalmax.toString());
      }
    }
    loadTest();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase
      .from("medicaltests")
      .update({ name, normalmin: Number(normalmin), normalmax: Number(normalmax) })
      .eq("id", id); 

    if (!error) router.push("/medicaltests"); 
  }

  return (
    <div className="p-10 max-w-lg mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-6">Edit Medical Test</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4 bg-white p-6 shadow-md rounded border">
        <div>
          <label className="block text-sm font-bold mb-1">Test Name</label>
          <input required type="text" className="w-full border p-2 rounded" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold mb-1">Normal Min</label>
            <input required type="number" className="w-full border p-2 rounded" value={normalmin} onChange={(e) => setNormalmin(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold mb-1">Normal Max</label>
            <input required type="number" className="w-full border p-2 rounded" value={normalmax} onChange={(e) => setNormalmax(e.target.value)} />
          </div>
        </div>
        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">
          Update Test
        </button>
      </form>
    </div>
  );
}