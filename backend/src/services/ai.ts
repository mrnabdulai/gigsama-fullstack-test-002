import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

// Initialize OpenAI client
const openai = new OpenAI({
});

// Define the input and output types for AI calls





// Start a new session with the first question
export async function startSession(initialInput: string) {
    const systemPrompt = `You are a concise database schema designer assistant. Your goal is to help users create database schema designs.
    IMPORTANT: Keep your responses brief and focused. Ask only ONE question at a time.
    Your responses should be 1-3 sentences maximum. Never list multiple questions.
    The user has already provided their initial request: "${initialInput}".`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: initialInput }
        ],
        temperature: 0.7,
        max_tokens: 100
    });

    // Extract the first question from the AI response
    const firstQuestion = response.choices[0]?.message?.content || 'Could you tell me more about the entities in your system?';

    return {
        question: firstQuestion
    };
}

// Get the next question based on previous Q&A
export async function getNextQuestion(previousQuestions) {
    // Check if we have a generated schema by looking at the previous questions
    const hasGeneratedSchema = previousQuestions.some(qa =>
        qa.question && qa.question.includes("DONE_ASKING_QUESTIONS")
    );

    // Create conversation history from previous Q&A
    const messages = [
        {
            role: 'system',
            content: `You are a concise database schema designer assistant.
        IMPORTANT RULES:
        1. Ask only ONE focused question at a time. Never list multiple questions.
        2. Keep your response to 1-3 sentences maximum.
        3. After 5-7 informative exchanges, indicate completion with: "DONE_ASKING_QUESTIONS"
        4. Your goal is to create a conversational, interactive experience.
        5. If the user indicates they're ready for the schema, wants you to just generate something, or have enough information, respond with: "DONE_ASKING_QUESTIONS"
        ${hasGeneratedSchema ?
                    `6. A schema has already been generated. Focus your questions on understanding what specific aspects they want to improve:
           - Entity additions/modifications
           - Attribute changes
           - Relationship adjustments
           - Constraint updates
           7. IMPORTANT: When suggesting improvements, always build upon the existing schema rather than creating a completely new one.
           8. If the user asks for specific improvements, acknowledge their request and respond with "DONE_ASKING_QUESTIONS" to proceed with implementing those improvements.`
                    :
                    `6. Topics to explore (one at a time):
           - Main entities
           - Key attributes
           - Relationships between entities
           - Data types
           - Constraints
           - Special requirements`
                }`
        }
    ];

    // Add previous questions and answers to the conversation
    previousQuestions.forEach(qa => {
        messages.push({ role: 'assistant', content: qa.question });

        // Only add user messages for answered questions
        if (qa.answer) {
            messages.push({ role: 'user', content: qa.answer });
        }
    });

    // Add a final prompt to get the next question
    messages.push({
        role: 'user',
        content: hasGeneratedSchema
            ? 'I would like to improve the generated schema. What specific aspect should we focus on? Remember to build upon the existing schema rather than creating a new one.'
            : 'What else do you need to know about my application to design the schema? If I want you to just generate something based on what we have so far, please do so.'
    });

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages as ChatCompletionMessageParam[],
        temperature: 0.7,
        max_tokens: 100
    });

    const content = response.choices[0]?.message?.content || '';

    // Check if AI is done asking questions or user wants to generate schema now
    if (content.includes('DONE_ASKING_QUESTIONS') || 
        previousQuestions[previousQuestions.length - 1]?.answer?.toLowerCase().includes('just generate') ||
        previousQuestions[previousQuestions.length - 1]?.answer?.toLowerCase().includes('generate now')) {
        return {
            hasNextQuestion: false
        };
    }

    return {
        hasNextQuestion: true,
        question: content
    };
}

// Generate schema based on all Q&A sessions
export async function generateSchema(sessions, existingSchema = null) {
    // Create conversation history from all Q&A sessions
    const messages = [
        {
            role: 'system',
            content: `You are a database schema designer assistant. Based on the conversation with the user,
      ${existingSchema ? 'improve the existing schema' : 'generate a universal schema representation'}. Your response should be in the following JSON format:
      {
        "schemaJson": {
          "entities": [
            {
              "name": "EntityName",
              "attributes": [
                {
                  "name": "attributeName",
                  "type": "string|number|boolean|date|etc.",
                  "required": true|false,
                  "unique": true|false,
                  "primaryKey": true|false,
                  "description": "Description of this attribute"
                }
              ],
              "relationships": [
                {
                  "name": "relationshipName",
                  "targetEntity": "TargetEntityName",
                  "type": "oneToOne|oneToMany|manyToOne|manyToMany",
                  "description": "Description of this relationship"
                }
              ]
            }
          ]
        },
        "schemaText": "/* Human-readable representation of the schema */",
        "suggestedTitle": "/* A short, descriptive title for this schema */"
      }
      
      The schemaJson should contain a universal representation of entities, their attributes, and relationships
      that could be adapted to any database system.
      The schemaText should be a human-readable text description of the schema.
      The suggestedTitle should be a short name describing the purpose of this schema.
      ${existingSchema ? 'IMPORTANT: Build upon and improve the existing schema rather than creating a completely new one. Incorporate the user\'s requested changes while preserving the overall structure.' : ''}`
        }
    ];

    // Add all questions and answers to the conversation
    sessions.forEach(qa => {
        messages.push({ role: 'assistant', content: qa.question });
        if (qa.answer) {
            messages.push({ role: 'user', content: qa.answer });
        }
    });

    // If we have an existing schema, include it in the conversation
    if (existingSchema) {
        messages.push({
            role: 'system',
            content: `Here is the existing schema that needs to be improved based on the user's feedback:
            ${JSON.stringify(existingSchema, null, 2)}
            
            Make targeted improvements to this schema based on the conversation, rather than creating a completely new schema.
            IMPORTANT: Make ONLY the specific changes requested by the user. Do not add new entities or fields unless explicitly requested.
            For example, if the user asks to add a 'usersCount' field to a 'Role' table, only add that specific field and nothing else.`
        });
    }

    // Add a final prompt to generate the schema
    messages.push({
        role: 'user',
        content: existingSchema 
            ? 'Please improve the existing MongoDB schema based on our conversation. Make ONLY the specific changes I requested and maintain the overall structure. Do not add any entities or fields that I did not explicitly ask for.'
            : 'Please generate the MongoDB schema based on our conversation so far.'
    });

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages as ChatCompletionMessageParam[],
        temperature: 0.5,
        response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content || '';

    try {
        // Parse the JSON response
        const schemaResponse = JSON.parse(content);

        return {
            schemaJson: schemaResponse.schemaJson || (existingSchema ? existingSchema.schemaJson : {}),
            schemaText: schemaResponse.schemaText || (existingSchema ? existingSchema.schemaText : ''),
            suggestedTitle: schemaResponse.suggestedTitle || (existingSchema ? existingSchema.suggestedTitle : 'Database Schema')
        };
    } catch (error) {
        console.error('Error parsing schema response:', error);

        // Return the existing schema if available, or a fallback response
        if (existingSchema) {
            return existingSchema;
        }
        
        return {
            schemaJson: {},
            schemaText: content,
            suggestedTitle: 'Database Schema'
        };
    }
}