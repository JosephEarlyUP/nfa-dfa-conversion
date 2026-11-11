/**
 * Formal 5-tuple descriptions for NFA and DFAs
 * @Author Joseph Early
 */


export interface NFA{
    states: string[];
    alphabet: string[];
    transitions: Record<string, Record<string, string[]>>;  //E.G Record<moveFromState, Record<action, moveToStates[]>>
    startState: string;
    acceptStates: string[];
}//NFA

export interface DFA{
    states: string[];
    alphabet: string[];
    transitions: Record<string, Record<string, string>>;    //Deterministic, so no need for a string array
    startState: string;
    endStates: string[];
}//DFA