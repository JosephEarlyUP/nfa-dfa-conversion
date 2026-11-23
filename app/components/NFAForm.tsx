/**
 * Form allowing user to input the five tuple description of an NFA for conversion.
 * @author Joseph Early
 */

'use client'

// Imports
import React from 'react';
import { useState } from 'react';
import { parseNFAForm } from '../conversion/parseNFAForm';
import { toast } from 'sonner';
import { NFA, DFA } from '../conversion/types';
import { validateNFA } from '../conversion/nfaValidation';
import { nfaToDFA } from '../conversion/nfaToDfa';

export default function NFAForm() {

    //states for each component of NFA Tuple   
    const [NFAStates, setNFAStates] = useState(''); //useState returns array w/ currValue and a setter
    const [NFAAlphabet, setNFAAlphabet] = useState('');
    const [NFAStartState, setNFAStartState] = useState('');
    const [NFAAcceptStates, setNFAAcceptStates] = useState('');


    //TRANSITION LOGIC
    const [NFATransitions, setNFATransitions] = useState([
        {fromState: '', action: '', toState: ''}
    ]);

    //Adds new empty transition 
    const addTransition = () => {
        setNFATransitions([...NFATransitions, { fromState: '', action: '', toState: ''}]);
    };

    //Removes a transition
    const removeTransition = (index: number) => {
        //Loop through all transitions and throw away the transition at our index
        setNFATransitions(NFATransitions.filter((_, i) => i !== index));    //filter loops for everything and tests against i== index here
    };//removeTransition

    //Updates a transition to match user input
    const updateTransition = (index: number, field: 'fromState' | 'action' | 'toState', value: string) => { //TS field formatting here is just like java enums

        //loop through all parameters and make new array to pass through setter
        const updatedTransitions = NFATransitions.map((transition, i) => {
            //check for index
            if(i === index) {
                return {...transition, [field]: value};
            }
            return transition;
        });

        setNFATransitions(updatedTransitions);
    };//updateTransition


    /**
     * Parses user input to a JSON, verified formatting, then converts to DFA.
     */
    const handleConversion = () => {
        try {
            const unverifiedNFA = parseNFAForm(
                NFAStates,
                NFAAlphabet,
                NFATransitions,
                NFAStartState,
                NFAAcceptStates
            );

            //Verify Inputs and convert to DFA
            const verifiedNFA: NFA = validateNFA(unverifiedNFA);
            console.log('NFA Validated');
            const equivDFA: DFA = nfaToDFA(verifiedNFA);
            console.log('NFA to DFA Conversion Complete')

            toast.success(`NFA to DFA Conversion Complete!`)

        } catch (error: any) {
            toast.error(`NFA Verification Error: ${error.message}`);
        }
    };


    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 max-w-md mx-auto flex flex-col gap-6">

            {/* FORM TITLE STUFF */}
            <div>
                <h2 className="text-lg font-semibold text-slate-800"> NFA Input </h2>
                <p className="text-sm text-slate-500">Configure your NFA's formal tuple description. </p>
                <p className="text-sm text-slate-500">(Q, Σ, δ, q₀, F)</p>
            </div>

            {/* NFA INPUTS */}

            {/* input box wrapper*/}
            <div className="flex flex-col gap-4">

                {/* STATES */}
                <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-md text-slate-800">States</label>
                    <input
                        type="text"
                        value={NFAStates}
                        onChange = {(e) => setNFAStates(e.target.value)}
                        placeholder = "q0, q1, q2"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none"
                    />
                </div>

                {/* ALPHABET */}
                <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-md text-slate-800">Alphabet</label>
                    <input
                        type="text"
                        value={NFAAlphabet}
                        onChange = {(e) => setNFAAlphabet(e.target.value)}
                        placeholder = "a, b"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none"
                    />
                </div>

                {/* TRANSITIONS */}
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-md text-slate-800">Transitions</label>
                    {NFATransitions.map((row, index) => (
                        <div key={index} className="flex items-center gap-2"> 

                            {/* FROM STATE */}
                            <input
                                type="text"
                                value={row.fromState}
                                onChange={(e) => updateTransition(index, 'fromState', e.target.value)}
                                placeholder="q0"
                                className="w-1/3 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slage-400 focus:border-black focus:outline-none"
                            />

                            {/* ACTION */}
                            <input
                                type="text"
                                value={row.action}
                                onChange={(e) => updateTransition(index, 'action', e.target.value)}
                                placeholder="ε"
                                className="w-1/4 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slage-400 focus:border-black focus:outline-none"
                            />

                            <span className="text-slate-400 text-sm">&rarr;</span> {/* ARROW -> */}

                            {/* TO STATE */}
                            <input
                                type="text"
                                value={row.toState}
                                onChange={(e) => updateTransition(index, 'toState', e.target.value)}
                                placeholder="q1, q2"
                                className="w-1/3 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slage-400 focus:border-black focus:outline-none"
                            />

                            {/* REMOVE TRANSITION*/}
                            {NFATransitions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeTransition(index)}
                                    className="text-slate-400 hover:text-red-500 text-sm px-1 cursor-pointer">
                                    x
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* ADD TRANSITION */}
                <button
                    type="button"
                    onClick={addTransition}
                    className="rounded-lg px-1 py-1 border border border-slate-300 hover:border-black focus:outline-none self-start text-xs font-semibold text-black hover:text-black flex items-center gap-1 cursor-pointer">
                    Add Transition
                </button>

                {/* START STATE */}
                <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-md text-slate-800">Start State</label>
                    <input
                        type="text"
                        value={NFAStartState}
                        onChange = {(e) => setNFAStartState(e.target.value)}
                        placeholder = "q0"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none"
                    />
                </div>

                {/* ACCEPT STATE */}
                <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-md text-slate-800">Accept States</label>
                    <input
                        type="text"
                        value={NFAAcceptStates}
                        onChange = {(e) => setNFAAcceptStates(e.target.value)}
                        placeholder = "q1, q2"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none"
                    />
                </div>
            </div>

            {/* SUBMIT NFA */}
            <button
                type="button"
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-black shadow-md cursor-pointer hover:bg-slate-100 hover:border-black focus:outline-none"
                onClick={handleConversion}
                >
                Convert to DFA
            </button>
        </div>
    );

}//NFAForm
