---
entries:
  - id: prompt-optimizer
    category: prompt
    title: Systematic Prompt Optimizer
    description: Designed an 8-step optimization process (deep understanding → structure analysis → spec building → iterative rewriting → ambiguity elimination → feasibility testing → final validation → sanity check) to transform vague prompts into actionable instructions with clear goals, constraints, and output formats.
    tools:
      - Claude Code
    outcome: Reduced AI response ambiguity and error rates; distilled into a reusable prompt design framework for daily development
    github: https://github.com/eqr91703/portfolio/tree/main/.claude/skills/prompt-optimizer/SKILL.md

  - id: agent-db-connect
    category: agent
    title: DB Environment Connection Automation Agent
    description: Encapsulated K8s context switching and KubeVPN connection into a single Skill command. The agent auto-detects the current environment, determines whether reconnection or context switching is needed, and polls until the connection is ready — supporting both development and production-copy environments.
    tools:
      - Claude Code
      - KubeVPN
      - kubectx
    outcome: Eliminated manual K8s context + VPN setup steps and the risk of environment mix-ups
    github: https://github.com/eqr91703/portfolio/tree/main/.claude/skills/db-connect/SKILL.md

  - id: agent-db-schema
    category: agent
    title: Natural Language DB Schema Query Assistant
    description: Searches a local Markdown Schema knowledge base using business keywords. Automatically selects between precise object search and domain index lookup based on query intent, supporting tables, stored procedures, functions, and views — no SQL or table name memorization required.
    tools:
      - Claude Code
    outcome: New engineers can query system architecture in Chinese; senior engineer interruptions dropped significantly
    github: https://github.com/eqr91703/portfolio/tree/main/.claude/skills/db-schema/SKILL.md

  - id: agent-db-select
    category: agent
    title: Multi-Step DB Query Workflow
    description: Chains connection validation (db-connect), schema lookup (db-schema), and SQL execution into one workflow. Describe your query in natural language and get results safely. Built-in read-only guards (blocks INSERT/UPDATE/DELETE) and auto-adds TOP 100 to unfiltered queries.
    tools:
      - Claude Code
      - MCP
    outcome: Standardized data query process; non-engineers can safely query data, eliminating SQL mishap risk
    github: https://github.com/eqr91703/portfolio/tree/main/.claude/skills/db-select/SKILL.md

  - id: tooling-sql-debug
    category: tooling
    title: Claude Code × Production SQL Debugging
    description: Brought real Production SQL timeouts and type conversion errors into Claude Code, driving root-cause analysis with hypothesis-plus-actual-error pairs. Successfully diagnosed hidden issues including connection pool exhaustion and nvarchar type mismatch bugs.
    tools:
      - Claude Code
    outcome: Shifted from "guess and test" to "confirm root cause then fix" — average debugging time significantly reduced

  - id: tooling-schema-docs
    category: tooling
    title: Large-Scale SQL Schema Documentation
    description: Converted an entire database schema (tables, stored procedures, functions, views) into 574 structured Markdown documents with a domain index and glossary, forming the foundation of an AI knowledge base. Managed API rate limits by capping agent concurrency at 3 parallel batches.
    tools:
      - Claude Code
    outcome: Produced 574 searchable schema docs that power AI-assisted development workflows

  - id: tooling-csharp-refactor
    category: tooling
    title: C# Backend Multi-File Refactoring
    description: Used Claude Code for cross-file C# refactoring including hierarchy traversal fixes, query migration to statistics tables, and API integration. Automatically ran dotnet build after each change to enforce zero-error validation, keeping refactors safe and controlled.
    tools:
      - Claude Code
      - .NET
    outcome: Multiple refactors achieved Fully Achieved with zero major rollbacks; build-verify workflow adopted as standard practice
---
