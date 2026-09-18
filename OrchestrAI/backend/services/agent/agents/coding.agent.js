import { getModel } from "../config/llmModels.js"
import { z } from "zod"

export const codingAgent = async (state) => {

    const intentLLM = await getModel("intent")
    const llm = await getModel("coding")

    //intent of using coding agent

    const intentLLMStructured = intentLLM.withStructuredOutput(
        z.object({
            intent: z.enum([
                "CODE_GENERATION",
                "CODE_REVIEW",
                "CODE_EXPLANATION",
                "DEBUGGING",
                "OPTIMIZATION",
                "CONVERSION",
                "DOCUMENTATION"
            ])
        })
    )

    const intentResult = await intentLLMStructured.invoke(`
Classify the user's coding request into exactly ONE of the following intents:

- CODE_GENERATION
- CODE_REVIEW
- CODE_EXPLANATION
- DEBUGGING
- OPTIMIZATION
- CONVERSION
- DOCUMENTATION

Definitions:

CODE_GENERATION:
The user wants new code or an implementation.
Examples:
- Implement Two Sum in C++
- Write a binary search function
- Create a REST API
- Build a React component

CODE_REVIEW:
The user provides code and asks for analysis, quality review, bugs,
bad practices, or improvements without primarily asking to rewrite it.

CODE_EXPLANATION:
The user mainly wants to understand existing code, an algorithm,
concept, syntax, or implementation.

DEBUGGING:
The user has an error, exception, incorrect output, crash, or broken
behavior and wants the problem identified and fixed.

OPTIMIZATION:
The user wants existing code improved for time complexity, space
complexity, performance, memory usage, or efficiency.

CONVERSION:
The user wants code converted from one language, framework,
library, or style to another.

DOCUMENTATION:
The user wants documentation, comments, README content, API docs,
or technical documentation for code.

User Request:
${state.prompt}
`)

    const intent = intentResult.intent

    console.log("CODING INTENT:", intent)


    //if intent is generating code for some perticular task

    if (intent === "CODE_GENERATION") {

        const generationPrompt = `
You are the Coding Agent of OrchestrAI.

Your job is to solve the user's programming request and produce BOTH:

1. A clear human-readable explanation.
2. The actual code as one or more files.

IMPORTANT:
Do NOT assume that every request is a full software project.

The user may ask for:
- DSA or competitive programming solutions
- Algorithms
- Data structures
- C++ / Java / Python / JavaScript code
- Small scripts
- Functions or classes
- SQL queries
- APIs
- Backend code
- Frontend components
- Websites
- Full-stack applications
- React applications
- Other programming tasks

Determine the appropriate implementation from the user's request.

----------------------------------------
EXPLANATION
----------------------------------------

The "explanation" field is shown directly in the normal chat UI.

It should explain the solution in a useful, natural way.

Depending on the request, include relevant information such as:

- What the solution does
- Approach / intuition
- Step-by-step explanation
- Important implementation details
- Time complexity
- Space complexity
- Why this approach is appropriate
- Important edge cases

Do NOT put the complete source code inside the explanation.

The explanation should NOT simply say:
"Code generated successfully."

It should actually explain what was implemented.

----------------------------------------
FILES
----------------------------------------

The "files" field contains the actual source code.

Each file must contain:

- A sensible filename
- Complete executable/source code
- No Markdown code fences
- No explanatory text outside the code

For a simple DSA problem, for example:

[
  {
    "name": "solution.cpp",
    "content": "complete C++ code here"
  }
]

For a web project, for example:

[
  {
    "name": "index.html",
    "content": "complete HTML"
  },
  {
    "name": "style.css",
    "content": "complete CSS"
  },
  {
    "name": "script.js",
    "content": "complete JavaScript"
  }
]

Only create multiple files when they are actually useful or required.

Do NOT create unnecessary files.

----------------------------------------
TECHNOLOGY RULES
----------------------------------------

Respect the technology explicitly requested by the user.

If the user specifies:
- C++ → use C++
- Python → use Python
- Java → use Java
- React → use React
- Next.js → use Next.js
- etc.

Do not replace the requested technology with another one.

If no technology is specified:

For small programming/DSA problems:
- Prefer a concise appropriate language based on the request/context.

For web development:
- Default to HTML, CSS, and JavaScript.
- Use React / Next.js / Vue only when explicitly requested or clearly required.

----------------------------------------
CODE QUALITY
----------------------------------------

Generate complete, correct, readable code.

Prefer:
- Meaningful variable names
- Appropriate data structures
- Clean structure
- Sensible error handling where applicable
- Correct edge-case handling
- Appropriate complexity

Do not add unnecessary dependencies.

Do not invent APIs, libraries, or files that are not required.

----------------------------------------
OUTPUT FORMAT
----------------------------------------

Return ONLY the structured output matching the provided schema.

The output must contain exactly:

{
  "explanation": "...",
  "files": [
    {
      "name": "...",
      "content": "..."
    }
  ]
}
  Images
  ----
  Aways use real unsplash imges.
  Never use placeholders.

Do NOT return:
- Markdown outside the structured fields
- Code fences
- Extra fields
- Comments outside the code
- "Here is your code"
- "Code generated successfully"

The explanation belongs in "explanation".
The source code belongs in "files".

----------------------------------------
USER REQUEST
----------------------------------------

${state.prompt}
`

        const generationLLM = llm.withStructuredOutput(
            z.object({
                explanation: z.string(),

                files: z.array(
                    z.object({
                        name: z.string(),
                        content: z.string()
                    })
                )
            })
        )
        
        const result = await generationLLM.invoke(generationPrompt)

        console.log("========== GENERATION RESULT ==========")
        console.log(result)
        console.log("TYPE:", typeof result)
        console.log("=======================================")

        return {
            ...state,
            intent,

            aiResponse: result.explanation,

            artifacts: [{
                id: Date.now(),
                type: "code",
                files: result.files || [],
                title:state.prompt
            }]
        }
    }


    //For the rest of the intents

    const response = await llm.invoke(`
You are OrchestrAI Coding Agent.

The user's coding intent is:

${intent}

Solve the user's request according to that intent.

Return a clear, helpful Markdown response.

Use the following structure when relevant:

# Overview

## Approach

## Explanation

## Problems
Use this section when discussing bugs or issues.

## Improvements
Use this section when discussing review or optimization.

## Complexity
Include time and space complexity when relevant.

## Solution
Provide the relevant code when needed.

## Example
Include an example when useful.

Adapt the structure to the user's actual request.
Do not force irrelevant sections.

The user may ask about:
- DSA
- Algorithms
- Data structures
- Debugging
- Code review
- Optimization
- Code explanation
- Conversion
- Documentation
- Programming concepts

Do not generate a project artifact for this branch.

Return Markdown only.

User Request:
${state.prompt}
`)

    return {
        ...state,
        intent,
        aiResponse: response.content,
        artifacts: []
    }
}