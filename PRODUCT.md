# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who post on X and want help writing: they sign in with their X account, describe a topic, and want a publishable post in a few minutes without leaving the app.

## Product Purpose

Vox is an AI writing assistant for X posts. The user describes a topic, Vox writes three drafts in different tones, the user refines a draft with plain-language instructions, and publishes it to X from inside the app. Success means a post the user is happy to publish, published from Vox.

## Core Flow and Vocabulary

**Post → Drafts → Refine → Publish.** Use these words in the UI; do not expose system terms (conversation, turn, message, prompt group).

- **Post**: one writing session about a topic (backend: conversation). Listed under Posts → All; the ones published to X are under Posts → Published.
- **Drafts**: three AI options per request, written in a fixed tone order (Standard, Playful, Educative) and labelled to match. Free accounts get 6 drafts in total, across all posts: a new set uses 3 (fewer if fewer are left). The composer always says what the next action will use.
- **Refine**: rewrite one draft with an instruction; produces a sequence of versions. Each refine uses 1 draft from the same allowance.
- **Publish**: review the post exactly as it will appear on X, optionally attach images, and post it.

## Scope

In scope today: the flow above. Out of the navigation until they are real features:

- **Overview**: intended to give actionable insights on how published posts perform (best posts, which tones and topics work, "write another like this"). Needs published posts linked to drafts plus X metrics.
- **Replies**: planned; purpose to be defined.
- **Campaigns**: not defined.

The source for Overview and Replies is kept in the repo but not routed.

## Constraints

- Publishing posts to the user's real X account is irreversible from the app; the publish step must show exactly what will be posted and confirm success with a link.
- Publishing is guarded on the server: the same text can't be posted twice by the same user (double clicks, retries, other devices). A refused duplicate returns the earlier post's id, and the app shows it as already posted.
- The backend records every post published from Vox with the draft and post it came from. That backs Posts → Published, the Posted mark on the Posts list, the Posted mark on draft cards, and the "Published" line on a post, so they're the same on every device. The browser keeps its own record (localStorage) only to show a post made since the page loaded. This link also unlocks Overview insights.
