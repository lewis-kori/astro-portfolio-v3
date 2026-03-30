---
title: "AI Is Not Your Intern. And That’s the Problem."
author: Lewis Kori
tags: [
  "ai",
  "agentic engineering",
  "systems thinking",
  "llms",
  "productivity",
  "software engineering",
  "mcp",
  "agents"
]
series: Human + AI
description: Why reliable AI workflows are not about better prompts, but about designing systems of context using skills, MCPs, and memory.
dateCreated: 2026-03-30
sponsors: ["Scraper API"]
---

When I first started using coding agents seriously, I made a familiar mistake.

I treated the model as the main thing.

I wrote better prompts. Then longer ones. Then more carefully structured ones.

Sometimes it worked beautifully.  
Sometimes it drifted.

Same repo. Same goal. Different result.

That inconsistency bothered me, because it revealed something deeper:

The bottleneck was not raw intelligence.  
It was context.

---

In [AI Is Not Replacing You. It’s Reshaping How You Think](/blog/ai-is-not-replacing-you-its-reshaping-how-you-think/), I wrote about how AI shifts the bottleneck upward. When generation becomes cheap, the differentiator becomes judgment, constraints, and systems thinking.

That same pattern shows up in agentic engineering.

The real leverage does not come from asking a model to do more.

It comes from designing a better system around the model.

---

## The Mistake I Kept Making

Early on, I was treating the agent like a very smart freelancer with amnesia.

I would drop it into a task, explain the problem, and expect one well-written instruction block to carry the entire interaction.

Sometimes it did.

But as soon as the work became real, things broke down.

Design fidelity mattered.  
SEO mattered.  
Content structure mattered.  
Localization mattered.  
Existing conventions mattered.  
Small decisions from earlier in the build mattered.

One prompt was never going to carry all of that.

That’s when it clicked:

Agentic engineering is not prompting.  
It’s environment design.

---

On a recent workflow, I wasn’t asking an agent to “build a website.”

I was asking it to:

- work inside a multilingual Astro codebase  
- preserve structured SEO  
- keep markdown content editable  
- support Arabic RTL layouts  
- respect project-specific rules already established  
- generate UI directions using [Stitch](https://stitch.withgoogle.com/)  
- interact with external tools through MCP integrations  

That’s not a prompt problem.  
That’s a context problem.

And context has to be layered.

---

> **If the model is the engine, skills are the practiced moves, MCPs are the ports to the outside world, and AGENTS.md is the field manual for the project.**

Once I started seeing the stack this way, everything became more stable.

---

## Skills Are Reusable Judgment

The clearest explanations of skills come from:

- [Anthropic’s Agent Skills Overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)  
- [Strapi: What Are Agent Skills](https://strapi.io/blog/what-are-agent-skills-and-how-to-use-them)  
- [Agent Skills Format](https://agentskills.io/what-are-skills)  
- [skills.sh](https://skills.sh) (a curated and security-conscious skill registry)

The idea is simple:

A skill packages repeatable expertise into something an agent can reuse.

That matters because prompts are temporary.

Skills are accumulated judgment.

Instead of re-explaining how to:

- audit SEO  
- structure content  
- apply system constraints  

…you encode it once.

Now every task starts from a higher baseline.

---

In practice, skills do three things:

- reduce repetition  
- reduce drift  
- make quality portable  

That last one is the real shift.

Without skills, success depends on remembering the right phrasing at the right time.

With skills, you turn one-off cleverness into infrastructure.

That’s leverage.

---

## MCPs Give Agents Reach

If skills shape how an agent thinks, MCPs shape what it can do.

The [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) is an open standard that connects models to external systems.

Models know patterns.

MCPs let them touch reality.

That reality includes:

- repositories  
- APIs  
- documentation  
- browsers  
- design tools like Stitch  
- databases  
- internal tools  

Without MCPs, an agent is reasoning in isolation.

With MCPs, it can:

- observe  
- verify  
- act  

That’s the difference between generating suggestions and executing work.

---

## AGENTS.md Gives Agents Memory

The part most teams underestimate is memory.

That’s where [AGENTS.md](https://agents.md/) comes in.

The simplest way to think about it:

It’s a README for agents.

But unlike a typical README, it captures the operational reality of a project:

- how the codebase behaves  
- which commands are safe  
- what constraints must be respected  
- what has already been learned  

In one of my workflows, this included things like:

- why Tailwind must stay locally compiled  
- why English routes remain unprefixed  
- how RTL must be handled  
- what business details must remain consistent  

Without this, the agent rediscovers the project every time.

With it, the agent starts from context.

---

This ties back to something I wrote in [Why I Write](/blog/why-i-write/):

Writing forces clarity.

Good documentation does the same thing for systems.

It turns implicit knowledge into something reusable.

---

## The Agent Is Not the System

This is the part that matters most.

People talk about agentic engineering as if the intelligence lives entirely inside the agent.

It doesn’t.

The agent is just one layer.

What makes the system reliable is the composition:

- the human provides intent and judgment  
- skills provide reusable expertise  
- MCPs provide access to reality  
- AGENTS.md provides memory  
- the agent executes within that structure  

That’s the system.

---

Recently, I watched a talk by Jacob Bank (ex-Google, founder of Relay.app) that reinforced this perspective:

A few ideas stood out:

- AI is not your intern  
- managing people becomes less central than designing systems  
- build one simple agent at a time  
- fire agents that don’t deliver  
- clarity of intent is everything  
- your personality becomes the differentiator  

That framing aligns closely with what I’ve experienced.

The leverage doesn’t come from one powerful agent.

It comes from how well the system around it is designed.

<iframe width="560" height="315" src="https://www.youtube.com/embed/OHJJKrJCSRU?si=h7XOFY5d8wu997Tl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

That’s why I don’t think the future belongs to people who are just good at prompting.

It belongs to people who can design systems of context.

People who can decide:

- what should be reusable  
- what should be connected  
- what should be constrained  
- what should remain human  

---

In [Building Better: Looking Back on 2025](/blog/building-better-looking-back-on-2025/), I wrote about building better systems around my life and work.

This is the same instinct.

The goal isn’t to layer AI onto existing habits.

The goal is to redesign the workflow so intelligence has somewhere useful to go.

---

Agentic engineering is not the art of finding one perfect prompt.

It’s the discipline of building context architecture that makes good work more likely.

That’s where the leverage is.

That’s where the quality comes from.

And that’s where the real craft of this era is being built.

---

## What I’m Exploring Next

This piece is part of a broader exploration into agentic systems.

Next, I’ll be diving deeper into:

- Model Context Protocol (MCP) and how it actually works in practice
- Designing skill libraries for real production workflows
- How to structure agent-first systems in real applications

## Further Reading

- [AI Is Not Replacing You. It’s Reshaping How You Think](https://lewiskori.com/blog/ai-is-not-replacing-you-its-reshaping-how-you-think/)  
- [Why I Write](https://lewiskori.com/blog/why-i-write/)  
- [Building Better: Looking Back on 2025](https://lewiskori.com/blog/building-better-looking-back-on-2025/)  
- [What Are Agent Skills and How To Use Them](https://strapi.io/blog/what-are-agent-skills-and-how-to-use-them)  
- [Anthropic: Agent Skills Overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)  
- [Model Context Protocol: Introduction](https://modelcontextprotocol.io/docs/getting-started/intro)  
- [AGENTS.md](https://agents.md/)  
- [What Are Skills?](https://agentskills.io/what-are-skills)  
- [skills.sh](https://skills.sh)
