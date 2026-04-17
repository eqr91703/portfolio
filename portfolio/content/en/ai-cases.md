---
entries:
  - id: prompt-optimizer
    category: prompt
    title: Systematic Prompt Optimizer
    description: Designed an 8-step optimization process (deep understanding → structure analysis → spec building → iterative rewriting → ambiguity elimination → feasibility testing → final validation → sanity check) to transform vague prompts into actionable instructions with clear goals, constraints, and output formats.
    tools:
      - Claude Code
    outcome: Rework rate dropped ~60%; design cycles shortened from 3–5 rounds to 1–2; framework distilled into a reusable Skill used in daily development
    github: https://github.com/eqr91703/portfolio/tree/main/.claude/skills/prompt-optimizer/SKILL.md

  - id: agent-db-connect
    category: agent
    title: DB Environment Connection Automation Agent
    description: Encapsulated K8s context switching and KubeVPN connection into a single Skill command. The agent auto-detects the current environment, determines whether reconnection or context switching is needed, and polls until the connection is ready — supporting both development and production-copy environments.
    tools:
      - Claude Code
      - KubeVPN
      - kubectx
    outcome: Saves 2–5 minutes per environment switch; zero mis-environment incidents since adoption; chains with db-schema / db-select into a complete query workflow
    github: https://github.com/eqr91703/portfolio/tree/main/.claude/skills/db-connect/SKILL.md

  - id: agent-db-schema
    category: agent
    title: Natural Language DB Schema Query Assistant
    description: Searches a local Markdown Schema knowledge base using business keywords. Automatically selects between precise object search and domain index lookup based on query intent, supporting tables, stored procedures, functions, and views — no SQL or table name memorization required.
    tools:
      - Claude Code
    outcome: 574 docs instantly searchable; new engineers query architecture in natural language; senior engineer interruptions estimated at 5–8 fewer per week
    github: https://github.com/eqr91703/portfolio/tree/main/.claude/skills/db-schema/SKILL.md

  - id: agent-db-select
    category: agent
    title: Multi-Step DB Query Workflow
    description: Chains connection validation (db-connect), schema lookup (db-schema), and SQL execution into one workflow. Describe your query in natural language and get results safely. Built-in read-only guards (blocks INSERT/UPDATE/DELETE) and auto-adds TOP 100 to unfiltered queries.
    tools:
      - Claude Code
      - MCP
    outcome: Query prep time cut from 10 min to under 1 min; zero SQL mishaps by non-engineers; data query process fully standardized
    github: https://github.com/eqr91703/portfolio/tree/main/.claude/skills/db-select/SKILL.md

  - id: tooling-sql-debug
    category: tooling
    title: Claude Code × Production SQL Debugging
    description: Brought real Production SQL timeouts and type conversion errors into Claude Code, driving root-cause analysis with hypothesis-plus-actual-error pairs. Successfully diagnosed hidden issues including connection pool exhaustion and nvarchar type mismatch bugs.
    tools:
      - Claude Code
    outcome: Average debug time cut from 2–4 hours to under 30 minutes; shifted to root-cause-first approach, reducing mis-fix risk

  - id: tooling-schema-docs
    category: tooling
    title: Large-Scale SQL Schema Documentation
    description: Converted an entire database schema (tables, stored procedures, functions, views) into 574 structured Markdown documents with a domain index and glossary, forming the foundation of an AI knowledge base. Managed API rate limits by capping agent concurrency at 3 parallel batches.
    tools:
      - Claude Code
    outcome: 574 docs + 1 Domain Index + 1 glossary produced in 5 days (vs. 2-week manual estimate); became the single source of truth for AI-assisted development

  - id: tooling-csharp-refactor
    category: tooling
    title: C# Backend Multi-File Refactoring
    description: Used Claude Code for cross-file C# refactoring including hierarchy traversal fixes, query migration to statistics tables, and API integration. Automatically ran dotnet build after each change to enforce zero-error validation, keeping refactors safe and controlled.
    tools:
      - Claude Code
      - .NET
    outcome: 7 cross-file refactors all Fully Achieved with zero major rollbacks; build-verify loop adopted as team SOP for all future refactoring
---
