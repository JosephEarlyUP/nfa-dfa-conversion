/**
 * Validates user input from NFAForm.tsx and returns the user defined NFA
 * @author Joseph Early
 */

export interface transition {
    fromState: string;
    action: string;
    toState: string;
}

export function parseNFAForm(
    NFAStates: string,
    NFAAlphabet: string,
    NFATransitions: transition[],
    NFAStartState: string,
    NFAAcceptStates: string
){
    //Sanity Check Input
    try {
        if (!NFAStates.trim()) {
            throw new Error("States cannot be empty");
        }
        if (!NFAAlphabet.trim()) {
            throw new Error("Alphabet cannot be empty");
        }
        if (!NFAStartState.trim()) {
            throw new Error("Start state cannot be empty");
        }

        //Parse and clean up user input
        const parsedStates = NFAStates.split(',').map(s => s.trim()).filter(Boolean);    //filter will only accept strings
        const parsedAlphabet = NFAAlphabet.split(',').map(s => s.trim()).filter(Boolean);
        const parsedAcceptStates = NFAAcceptStates.split(',').map(s => s.trim()).filter(Boolean);

        //Parse and map transitions
        const transitions: Record<string, Record<string, string[]>> = {}; //Match NFA JSON for transitions
        NFATransitions.forEach(t => {   //cursed for each loop syntax wtf

            //isolate each part of the transition
            const fromState = t.fromState.trim();
            const action = t.action.trim();
            const toStateInput = t.toState.trim();

            //sanity checks for complete transitions (empty action is valid as epsilon)
            if( !fromState || !toStateInput) { return; }    

            //Make sure transitions exist for fromState and action
            if(!transitions[fromState]) { 
                transitions[fromState] = {};
            }

            if(!transitions[fromState][action]) {
                transitions[fromState][action] = [];
            }

            //Needs to map out into inner array since multiple toStates are valid
            const toStates = toStateInput.split(',').map(s => s.trim()).filter(Boolean);
            toStates.forEach(toState => {
                if (!transitions[fromState][action].includes(toState)) { //if the toState isnt in the transition, push it
                    transitions[fromState][action].push(toState);
                }
            });
        });

        //Put NFA together
        const unverifiedNFA = {
            states: parsedStates,
            alphabet: parsedAlphabet,
            transitions: transitions,
            startState: NFAStartState.trim(),
            acceptStates: parsedAcceptStates
        };

        return unverifiedNFA;

    } catch (error: any) {
            throw new Error(`NFA Validation Error: ${error.message}`)
    }
}//parseNFAForm