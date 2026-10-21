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

- **Post**: one writing session about a topic (backend: conversation). Listed under Posts.
- **Drafts**: three AI options per request, labelled by tone (Standard, Playful, Educative). A post allows 6 draft requests.
- **Refine**: rewrite one draft with an instruction; produces a sequence of versions. Unlimited.
- **Publish**: review the post exactly as it will appear on X, optionally attach images, and post it.

## Scope

In scope today: the flow above. Out of the navigation until they are real features:

- **Overview**: intended to give actionable insights on how published posts perform (best posts, which tones and topics work, "write another like this"). Needs published posts linked to drafts plus X metrics.
- **Replies**: planned; purpose to be defined.
- **Campaigns**: not defined.

The source for Overview and Replies is kept in the repo but not routed.

## Constraints

- Publishing posts to the user's real X account is irreversible from the app; the publish step must show exactly what will be posted and confirm success with a link.
- The backend does not yet record which draft was published. Until it does, "Posted" state is stored per user in the browser (localStorage). Backend follow-up: accept the draft id on `POST /api/post` and store the returned post id, which unlocks durable Posted state and the Overview insights.
