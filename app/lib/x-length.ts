import twitter from "twitter-text";

// X's limit for standard accounts. Paid accounts can go longer, so the app
// warns past it instead of blocking; X rejects the post if the account can't.
export const X_CHAR_LIMIT = 280;

// Counted the way X counts: emoji and CJK as 2, every link as 23.
export const xLength = (text: string): number => twitter.parseTweet(text).weightedLength;
