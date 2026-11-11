/**
 * Entry point for NFA->DFA conversion
 */

import fs from 'fs/promises';
import * as path from 'path';
import { validateNFA } from './nfaValidation';


async function testDFA() {
    const fileName = "DFA1.json";
    const filePath = path.join(__dirname, "testDFAs", fileName); // path for testDFAs (conversion/testDFAs

    try {
        //Read the JSON
        const rawJSON = await fs.readFile(filePath, 'utf-8');    //await for async
        const parsedJSON = JSON.parse(rawJSON);
        validateNFA(parsedJSON); //validate NFA
        console.log("NFA format correct")

    } catch (error: any) {
        console.error(error.message);
    }
}//testDFA

testDFA();