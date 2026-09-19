# FIVE TIMES FIVE

A workshop chatbot designed to teach a user how to solve 5 × 5 without revealing the answer.

The model is also instructed not to discuss topics outside 5 × 5 and concepts directly necessary to teaching it.

The behavioral boundaries exist only in the model instructions. The application does not inspect, rewrite, validate, or replace model responses.

## Vercel

Add the environment variable `OPENAI_API_KEY`.

The app uses `gpt-4o-mini`, limits conversations to 10 user messages, and limits each message to 2,000 characters.
