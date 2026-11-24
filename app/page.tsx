'use client'

import React, { useState } from 'react';
import NFAForm from "./components/NFAForm";
import DFAGraph from "./conversion/DFAGraph";
import dfaData from './conversion/outputDFAs/DFA1.json';
import { DFA } from './conversion/types';
import initialDfaData from './conversion/outputDFAs/DFA1.json';

export default function Page() {
  const [dfaData, setDfaData] = useState<DFA>(initialDfaData as DFA);

  
  return (
    <main className="h-screen w-screen bg-slate-100 flex flex-col lg:flex-row p-6 gap-6 overflow-hidden">
      
      <section className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col overflow-hidden">
        <div className="flex flex-col items-center justify-between pb-4 border-b border-slate-100 mb-4 shrink-0">
          <h2 className="text-lg font-semibold text-slate-800">Equivalent DFA</h2>
          <h2 className="text-sm font-semibold text-slate-600">All Accept States are colored blue and the start state is colored green</h2>
        </div>
      
        <div className="flex-1 w-full h-full min-h-100">
          <DFAGraph dfa={dfaData} />
        </div>
      </section>

      <aside className="w-full lg:w-105 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-y-auto shrink-0 flex flex-col justify-start">
        <NFAForm onConversionComplete={(newDfa: DFA) => setDfaData(newDfa)} />
      </aside>

    </main>
  );
}