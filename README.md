## NFA to DFA full-stack app
A NextJS web application for NFA to DFA conversion with DFA visualization using React Flow.

### To Access on Vercel
* [Visit on Vercel](https://nfa-dfa-conversion-4izt.vercel.app)

### Dependencies
* Please ensure you have NodesJS installed and some package manager (npm, pnpm, etc).

### To Run Locally
1. Clone the repository
```bash
git clone https://github.com/JosephEarlyUP/nfa-dfa-conversion.git
cd nfa-dfa-conversion
```

2. Install dependencies
```bash
pnpm install
```

3. Run in production mode
```bash
pnpm build
pnpm start
```
- Alternatively to run for development
```bash
pnpm dev
```

### JSON Format for NFA input files
* When uploading an NFA JSON for conversion, please ensure it follows the provided syntax. Otherwise, customize an NFA for conversion using the form.
```
{
  "states": ["q0", "q1", "q2"],
  "alphabet": ["a", "b"],
  "transitions": {
    "q0": {
      "a": ["q1"],
      "b": ["q0"]
    },
    "q1": {
      "a": ["q2"],
      "b": ["q0"]
    },
    "q2": {
      "a": ["q2"],
      "b": ["q2"]
    }
  },
  "startState": "q0",
  "acceptStates": ["q2"]
}
```

