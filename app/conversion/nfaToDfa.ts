/**
 * Generate an equivalent DFA for some given NFA and return as JSON
 * @author Joseph Early
 */

import { stringify } from "querystring";
import { DFA, NFA } from "./types";

/**
 * Takes an NFA and returns an equivalent DFA
 * @param NFA 
 */
export function nfaToDFA(NFA: NFA): DFA {

    // Destructure NFA for easier access
    const { states, alphabet, transitions, startState, acceptStates } = NFA;
    const dfaStartState = epsilonClosure(startState, transitions);      //new DFA start
    const dfaTransitions: Record<string, Record<string, string>> = {};  //new DFA transitions

    //Setup stack and set for iteration
    const processedStates = new Set<string>();  //keep track of what we've seen to avoid reprocessing a state
    const currStack = [dfaStartState];

    // Explore till everything is processed
    while(currStack.length > 0) {

        //CURRENT STATE (E.G Q0,Q1) PROCESSING
        const currState = currStack.pop() as string;        //as string to make compiler happy
        if(processedStates.has(currState)) { continue; }    //If state was already processed, skip
        processedStates.add(currState);                     //Otherwise, process it

        //SPLIT INTO ARRAY (E.G Q0,Q1 -> ["Q0", "Q1"])
        const currStateArr = currState.split(',');

        //LOOP THROUGH ALL POSSIBLE ACTIONS (besides epsilon)
        for(let i = 0; i < alphabet.length; ++i) {  //Loop through every possible action for state being processed
            if(alphabet[i] === "") { continue; }    //skip over epsilon here
            const visitedFoundStates = new Set<string>();
            
            //CHECK ALL STATES FOR CURRENT ACTION
            for(let j = 0; j < currStateArr.length; ++j) {
                const foundStates = transitions[currStateArr[j]]?.[alphabet[i]] || [];  //curr[state] currAction -> what states? 
                for(let k = 0; k < foundStates.length; ++k) {

                    //CHECK FOR EPSILON TRANSITIONS FROM FOUND STATES
                    const reachableStates = epsilonClosure(foundStates[k], transitions); //Account for last epsilon transitions
                    const reachableStateArr = reachableStates.split(',');
                    for(let l = 0; l < reachableStateArr.length; ++l) {
                        visitedFoundStates.add(reachableStateArr[l]);
                    }

                }//foundStates iter.
            }//currStateArr iter.

            //LOG NEW TRANSITION
            if(visitedFoundStates.size === 0) { continue; } //sanity check
            const newTransition = Array.from(visitedFoundStates).sort().join(',');
            
            if(!dfaTransitions[currState]) { dfaTransitions[currState] = {}; }  //inner record needs to exist to add transition
            dfaTransitions[currState][alphabet[i]] = newTransition;

            if(!processedStates.has(newTransition)) {
                currStack.push(newTransition);
            }
    
        }//alphabet inter.
    }//queue iter.

    //Find new end states
    const dfaStates = Array.from(processedStates);
    const dfaAcceptStates: string[] = [];
    for(let i = 0; i < dfaStates.length; ++i) {
        const currDfaState = dfaStates[i];
        const currDfaStateArr = currDfaState.split(',');
        let accepts = false;

        for(let j = 0; j < currDfaStateArr.length; ++j) {
            if(acceptStates.includes(currDfaStateArr[j])) { //Check if any section of the DFA state is in NFA accepting state array
                accepts = true;
            }
        }

        if(accepts) { dfaAcceptStates.push(currDfaState); }
    }//dfaStates iter.

    const equivDFA: DFA = {
        states: dfaStates,
        alphabet: alphabet.filter(s => s !== ""), //Remove epsilon transitions
        transitions: dfaTransitions,
        startState: dfaStartState,
        acceptStates: dfaAcceptStates
    };

    return equivDFA;
}//nfaToDFA

/**
 * Returns the epsilon closure of a set of states
 * 
 * @param state State to check transitions from
 * @param transitions All NFA transitions
 */
function epsilonClosure(state: string, transitions: Record<string, Record<string, string[]>>): string {

    //Keep track of processed states and init. queue
    const processedStates = new Set<string>();  //Set to reduce duplicates
    const currStack = [state];

    //Iterate through queue
    while(currStack.length > 0) {
        const currState = currStack.pop() as string
        if(processedStates.has(currState)) { continue; }    //Same logic is main loop here
        processedStates.add(currState);                     

        //Find all reachable states with epsilon and add them to the queue
        const reachableStates = transitions[currState]?.[""] || [];   //"" represents epsilon here, might change it later ( || [] in case no epsilon transitions exist from state)
        for(let i = 0; i < reachableStates.length; ++i) {
            const reachedState = reachableStates[i];
            if(!processedStates.has(reachedState)) { 
                currStack.push(reachedState);
            }
        }//reachedStates iter.

    }//queue iteration

    const finalClosure = Array.from(processedStates).sort().join(','); //, for delimiter for now, also might change idk (q0,q1,q2 formatting for joined single state)
    return finalClosure;
}//epsilonClosure
