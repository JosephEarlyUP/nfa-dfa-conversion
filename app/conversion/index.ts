/**
 * Entry point for NFA->DFA conversion
 */

import fs from 'fs/promises';
import * as path from 'path';
import { validateNFA } from './nfaValidation';
import { nfaToDFA } from './nfaToDfa';


async function testNFA() {
    const fileName = "NFA2.json";
    const filePath = path.join(__dirname, "testNFAs", fileName);

    try {
        //Read the JSON
        const rawJSON = await fs.readFile(filePath, 'utf-8'); 
        const parsedJSON = JSON.parse(rawJSON);
        validateNFA(parsedJSON); //validate NFA
        console.log("NFA format correct")

        const equivDFA = nfaToDFA(parsedJSON);

        const outputFileName = "DFA1.json";
        const outputFilePath = path.join(__dirname, "outputDFAs", outputFileName);

        await fs.writeFile(outputFilePath, JSON.stringify(equivDFA, null, 2), 'utf-8')

    } catch (error: any) {
        console.error(error.message);
    }
}//testDFA

testNFA();