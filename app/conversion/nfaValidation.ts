/**
 * Sanity checks for NFA JSON
 * @author Joseph Early
 */

import { NFA } from "./types";


/**
 * Sanity check for every component of the formal NFA 5-tuple description.
 * @param inputNFA 
 * @returns NFA
 */ 
export function validateNFA(inputNFA: unknown): NFA {

    //Verify JSON input
    if(!inputNFA || typeof inputNFA !== 'object') { //!inputNFA is a null check
        throw new Error("NFA must be a JSON object");
    }

    //typecast to bypass compiler issues then verify JSON structure matches NFA struct
    const possibleNFA = inputNFA as unknown as Record<string, unknown>;
    verifyFormat(possibleNFA);


    //VERIFY STATES FROM Q
    const states = possibleNFA.states as string[];
    const startState = possibleNFA.startState as string;
    const acceptStates = possibleNFA.acceptStates as string[];

    //Verify start state in Q
    if(!inStates(startState, states)) { throw new Error("startState not in Q"); }
  
    //Verify all acceptStates in Q 
    for(let i = 0; i < acceptStates.length; ++i) {
        if(!inStates(acceptStates[i], states)) {
            throw new Error("all acceptStates must be in Q");
        }
    }//acceptStates check

    //Verify all transitions
    const transitions = possibleNFA.transitions as Record<string, unknown>; //make compiler happy
    const alphabet = possibleNFA.alphabet as string[];
    verifyTransitions(transitions, states, alphabet);

    
    return inputNFA as unknown as NFA; //temp
}//validateNFA

/**
 * Verifies all referenced states are in Q and all actions are in the alphabet
 */
function verifyTransitions(transitions: Record<string, unknown>, states: string[], alphabet: string[]): void {

    const transitionStates = Object.keys(transitions); //returns array of outer key
    for(let i = 0; i < transitionStates.length; ++i) {

        //Verify all fromStates are in Q
        if(!inStates(transitionStates[i], states)) {
            throw new Error("All states referenced in transitions must be in Q");
        }

        //Check actions and toStates 
        const innerRecord = transitions[transitionStates[i]];   //inner Record<action, states[]>
        if(!innerRecord || typeof innerRecord !== 'object' || Array.isArray(innerRecord)) {
            throw new Error("transitions JSON formatting incorrect (inner Record)");
        }

        //typecast for compiler then check actions
        const checkedInnerRecord = innerRecord as Record<string, unknown>;
        const actions = Object.keys(checkedInnerRecord);

        for(let j = 0; j < actions.length; ++j) {
            //Verify action is in alphabet
            if(actions[j] !== "" && (!inAlphabet(actions[j], alphabet))) {
                throw new Error("all transition actions must be in alphabet");
            }

            const toStates = checkedInnerRecord[actions[j]];
            if(!Array.isArray(toStates)) { throw new Error("toStates for transition must be valid array"); }
            const checkedToStates = toStates as unknown[]; //check for string iteratively for each toState
            for(let k = 0; k < checkedToStates.length; ++k) {
                const currState = checkedToStates[k];
                if(typeof currState !== 'string' || !inStates(currState, states)) {
                    throw new Error("all toStates in transition must be in Q");
                }
            }

        }//action check

    }//transition state check

}//verifyTransitions

/**
 * Verifies the formatting of the passed through NFA matches the NFA interface from types
 * @param possibleNFA
 */
function verifyFormat(possibleNFA: Record<string, unknown>): void {
    
    //Check states, endstates, and alphabet are valid arrays
    if(!Array.isArray(possibleNFA.states)) { throw new Error("states must be a valid array"); }
    if(!Array.isArray(possibleNFA.acceptStates)) { throw new Error("acceptStates must be a valid array"); }
    if(!Array.isArray(possibleNFA.alphabet)) { throw new Error("alphabet must be a valid array"); }

    //Check startState is a valid string
    if(typeof possibleNFA.startState !== 'string') { throw new Error("startState must be a valid string"); }

    //Check transitions is a valid object, not null, and not array (cause thats an obj for some reason)
    if(!possibleNFA.transitions || typeof possibleNFA.transitions !== 'object' || Array.isArray(possibleNFA.transitions)) {
        throw new Error("transitions must be valid JSON");
    }
}//verifyFormat

//Verify state is in Q
function inStates(state: string, states: string[]): boolean {
    return states.includes(state);
}//inStates


//Verify action is in alphabet
function inAlphabet(action: string, alphabet: string[]): boolean {
    return alphabet.includes(action);
}