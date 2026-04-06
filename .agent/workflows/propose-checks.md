---
description: /propose-checks - Derives an exhaustive, MECE verification checklist from any input using the Promise Decomposition Algorithm.
---

# Propose Checks

Derive a complete verification checklist from any input — text, documentation, code, or a combination. The output is a structured list of independently verifiable checks that define what "done" means for the described subject.

## EXECUTION RULES (READ BEFORE ANYTHING ELSE)

0. **Template Fidelity is STRICT.** You MUST strictly copy and use the template provided at the bottom (`## §T — TEMPLATE`). Do NOT omit any headers, sections, tables, or gates. Bypassing or omitting template elements is considered a critical failure and skipping steps will result in immediate rejection.

1. **Two documents, always.** You MUST produce exactly TWO artifacts using the internal artifact system (not saving directly to the user's repository folder):
   - **Working document** — named `[subject]_working.md`. Created at the start from the TEMPLATE (§T). Contains all gates, reasoning, atomicity tables, and audit trails. This is your working surface.
   - **Clean document** — named `[subject]_checklist.md`. Created ONLY after all gates pass, during Step 8. Contains only the final deliverable sections. No gates, no reasoning, no status markers.
   Both documents are mandatory. The clean document is the deliverable. The working document is the audit trail. Both must be created using the `write_to_file` tool with `IsArtifact: true` so they reside purely in the chat session's artifact space. Never deliver the working document as the final product.

2. **Gates are blocking.** Each phase ends with a GATE. You MUST NOT begin the next phase until every guardrail in the current gate shows ✅ or is explicitly resolved. If a guardrail shows ❌, the instructions next to it tell you exactly what to do. Fix it, then re-check. There are no exceptions.

3. **Show reasoning where demanded.** Steps marked "show work" require you to write your reasoning inside the working document BEFORE recording your verdict. Skipping the reasoning and jumping to the verdict is a gate violation.

4. **No invention, no assessment.** Every actor, promise, and check must be traceable to the input. Do not invent features, endpoints, or behaviors not described or implied by the input. If you infer something that cannot be confirmed from the available input (text or code), tag it `[INFERRED]`. Never present inference as established fact. Do not assess, evaluate, or comment on the system's current capability — your output is the verification instrument, not the verification itself.

5. **Process actors one at a time.** In Phase 2, complete ALL five categories for one actor before moving to the next. Do not fill partial rows across multiple actors.

6. **Decompose, do not inflate.** If the atomicity test (Phase 4) reveals a compound check, decompose it into sub-checks that each verify ONE promise. Do not add checks that verify promises not present in the matrix.

7. **Cleanup is mandatory.** When all gates pass, create the clean document per Step 8. The clean document is a SEPARATE artifact from the working document — not an edit of it.

8. **No outcome estimation.** You MUST NOT estimate, predict, or comment on whether any check would pass or fail if executed against the actual system. Do not write phrases like "this check is likely to pass," "the code already handles this," or "this would probably fail." The checklist defines WHAT to verify. Whether each check passes or fails is discovered by RUNNING the checks, not by reading code or reasoning about capability. The checklist is independent of the system's current state. This rule applies to the working document, the clean document, AND your conversational response to the user.

9. **Reasoning stays in the working document.** ALL reasoning, derivation, and deliberation happens INSIDE the working document. Your conversational response to the user should contain ONLY: a brief summary of the result (actor count, check count, key observations) and a link to the clean document. Do not reproduce gate resolution, atomicity analysis, or phase-by-phase reasoning in the chat.

---

## STEP 0: Input Classification

Before starting Phase 0, determine what input you have:

1. Read the user's message following `/propose-checks`. This is the **text input**.
2. Inspect the working directory. If it contains source code files in any programming language → **code is available**. List the top-level directory structure.
3. If a docs/ directory, README, or specification files exist → **documentation is available**. List the files.

Record your classification in the working document under `## Input Classification`. This determines:
- If code is available → you MUST read relevant files during Phases 1 and 2.
- `G4-CODE-DERIVED` activates ONLY if code is available.
- If neither code nor docs are available → you work exclusively from the text input. Resolution will be limited by text fidelity.

### Domain Knowledge Scan

Scan the input for technical specifications about the **problem space** — file format structures, data schemas, protocol behaviors, regulatory requirements, or any description of what the system must correctly handle at a technical level. Record these in the working document under `## Domain Knowledge`. These are NOT implementation choices. They will inform Correctness and Integrity promises in Phase 2.

The distinction: if the specification describes the PROBLEM (how files are structured, what data exists, what regulations require), it is domain knowledge. If it describes the SOLUTION (which library to use, which framework to build with), it is an implementation choice and should be ignored for check generation.

### Author-Provided Checks Scan

Scan the input for statements that describe **expected observable behavior** — explicit or implicit verification criteria stated by the author of the input. These are assertions the author already considers important. Record them verbatim in the working document under `## Author-Provided Checks (verbatim)`. These will be preserved as a separate section in the clean document. Algorithm-derived checks must NOT duplicate them.

### Platform Constraint Extraction

Scan the input for **named deployment platforms or hosting environments** (any specific platform the system is stated to deploy on). If found, record in the working document under `## Platform Constraints`:

1. **Platform name** — as stated in the input.
2. **Enforced constraints** — what this platform architecturally prevents the system's code from doing, regardless of implementation. These are properties the platform guarantees by construction.
3. **Pre-filtered promise categories** — for each enforced constraint, list the Actor × Category cells where generating a promise would be redundant because the platform already guarantees it. These cells will be marked "Pre-filtered — guaranteed by [Platform]" during Phase 2 instead of generating and then purging promises.

This pre-filter applies to the **Operator** actor and to the **platform itself as a potential Dependency**. It does NOT apply to Consumer actors — the platform constrains the deployment, not the client-side code.

### Scope

The input can describe any scope: an entire system, a single feature, a proposed change, or even an intention. The algorithm operates identically regardless of scope. Scope is a property of the input, not a parameter of the algorithm. Do not ask the user to clarify scope. Process whatever the input describes.

Then resolve **GATE 0-INPUT**:

- **G0-IN-DOMAIN:** Did you extract Domain Knowledge? If no technical specs exist, write "None found."
- **G0-IN-AUTHOR:** Did you extract Author-Provided Checks? If no explicit checks exist, write "None found."
- **G0-IN-PLATFORM:** Did you extract Platform Constraints? If no platform named, write "None found."

Mark each ✅ or ❌. Resolve all ❌ before proceeding.

---

## STEP 1: Phase 0 — System Identity

Compress the subject's reason for existence into exactly ONE sentence. The sentence must answer simultaneously: What does it do? For whom? Why does it matter?

Write this sentence in the working document under `## System Identity`.

Then resolve **GATE 0**. For each guardrail:

- **G0-TECH:** Read your sentence word by word. Does it contain ANY name of a technology, framework, language, protocol, file format, or tool? If yes → rewrite without it.
- **G0-BENEFICIARY:** Does the sentence name at least one concrete beneficiary? The beneficiary can be human or machine, but it must be specific enough to distinguish from "everyone." If no → rewrite with a concrete beneficiary.
- **G0-AGNOSTIC:** Mentally replace the implied technology with something completely different. Would the sentence still be true? If no → the sentence is tech-dependent. Rewrite.

Mark each ✅ or ❌ in the gate table. If any is ❌, rewrite the sentence and re-evaluate. Do NOT proceed to Step 2 until all three show ✅.

---

## STEP 2: Phase 1 — Actor Discovery

### 2a — Derivation (show work)

Extract the verbs and subjects/objects from the Phase 0 sentence. Write them out explicitly in the working document under `### Derivation`. Format:

```
Verbs: [list]
Subjects/Objects: [list]
```

### 2b — Actor Listing

From the verb-subject pairs, infer actors. For each actor, classify using this schema:

| Type | Definition | Test |
|---|---|---|
| **Consumer** | Receives value by interacting with the subject's interface | Does this entity USE the subject directly? |
| **Artifact Consumer** | Receives value from the subject's OUTPUT, not its interface | Does this entity only touch what the subject PRODUCES? |
| **Contributor** | Injects data or content into the subject | Does this entity FEED the subject without using the interface? |
| **Operator** | Maintains and administers the subject | Does this entity KEEP the subject running? |

**Consumer vs. Contributor disambiguation:** If an entity both FEEDS data into the subject AND USES its interface to do so, it is a **Consumer**, not a Contributor. Contributor is reserved for entities that inject data through non-interface channels (APIs, file drops, data imports) without using the subject as an end-user would. When in doubt, apply the test: "Does this entity interact with the subject's interface?" If yes → Consumer.

**Do NOT list Dependencies.** They are discovered in Phase 2 during promise extraction.

### 2c — Code Scan (only if code is available)

Read route files, authentication config, scheduled jobs, and export/output logic. Look for actors not visible from text alone:
- Different route groups → different Consumer types
- API key validation → machine Consumer
- Cron/scheduler → Operator or future Dependency
- File generation / export → Artifact Consumer

### 2d — Interface vs. Output Test

For every actor, record: "This actor interacts with: **INTERFACE** / **OUTPUT** / **BOTH**". This determines Consumer vs. Artifact Consumer classification.

Then resolve **GATE 1**:

- **G1-DERIVATION:** Were verbs/subjects explicitly extracted before listing actors? If not → go back to 2a.
- **G1-MINIMUM-ACTORS:** Count ≥ 1? If count is 0 → the input is insufficient. Declare this to the user and STOP. Do not proceed.
- **G1-EXTERIOR:** Is every listed actor an entity EXTERNAL to the subject? Internal components (database module, cache layer, template engine) are not actors. If any is internal → remove it.
- **G1-NO-PREMATURE-DEP:** Did you list any Dependencies? If yes → remove them. Dependencies emerge from Phase 2.
- **G1-ARTIFACT-TEST:** Does every actor have the interface/output/both classification recorded? If any is missing → record it.
- **G1-CONSUMER-CHECK:** For every actor classified as Contributor: does this entity interact with the subject's interface? If yes → reclassify as Consumer.

Mark each ✅ or ❌. Resolve all ❌ before proceeding.

---

## STEP 3: Phase 2 — Promise Extraction

Process ONE actor at a time. For each actor, fill ALL five categories before moving to the next actor.

### Domain Knowledge Integration

When filling promises, actively reference the Domain Knowledge extracted in Step 0. Technical specifications about the problem space translate directly into Correctness and Integrity promises. **CRITICAL (Dimensionality Expansion):** You MUST map the variance within your Domain Knowledge. If the problem space contains distinct logical domains, variations in input context, diverse regulatory requirements, or multiple operational states, you MUST generate separate atomic promises for each discrete dimension. Aggressively bundling inherent domain variations into a single generic functionality promise is considered a critical failure in algorithmic depth.

### Platform Constraint Application

Before generating a promise for any Actor × Category cell, check the Platform Constraints extracted in Step 0. If a cell was marked as pre-filtered, write: "Pre-filtered — guaranteed by [Platform]. [One-sentence explanation]." Then apply the Coverage Preservation Rule below: attempt to find a DIFFERENT, non-tautological promise for this same Actor × Category. If none exists, mark the cell N/A.

### The Five Categories

For each category, write the specific promise the subject makes to this actor. If a category does not apply, write: "Not applicable — [one-sentence reason]."

**A. Availability** — Can this actor access the subject when they need it?
  - Does the primary interface exist and respond?
  - Is response time acceptable for this actor's context?
  - Is access possible from the expected environment?

**B. Functionality** — Does the subject do what it promises for this actor?
  - Can every expected workflow be completed end-to-end?
  - Are edge cases handled (empty results, boundary inputs)?

**C. Correctness** — Is what the subject shows or returns accurate?
  - Are data values accurate and consistent?
  - Are ordering, formatting, encoding correct?
  - Are entity relationships coherent?

**D. Integrity** — Does the subject protect what it should?
  - Are access controls enforced?
  - Are destructive operations guarded?
  - Is data preserved across write-read cycles?

**E. Resilience** — Does the subject recover from failures?
  - What happens when a dependency fails?
  - Are failures detected and surfaced to the right actor?

### Falsability Sweep (show work — apply to every promise)

After writing each promise, you MUST answer TWO questions in sequence. Write your reasoning for BOTH in the working document before recording your verdict.

**Question 1 — Logical Tautology:** Is this promise guaranteed by a layer BELOW the system's boundary (operating system, filesystem, network protocols, hardware)? Most platform-level tautologies should have been caught by the Platform Constraint pre-filter in Step 0. This question serves as a safety net for guarantees from layers not covered by the pre-filter.

If the answer is YES → mark `[TAUTOLOGICAL-LOGICAL — removed]` and do not generate a check.

**Question 2 — Architectural Tautology:** Given the architecture observable from the input (text description, code if available, documentation if available), could this promise be broken by a **defect in the code that exists today** — a logic error, a race condition, a missing validation, a broken dependency?

Do NOT consider hypothetical future code additions as failure mechanisms. "Someone could add a tracking script" is NOT a defect in today's code. "The serializer might drop Unicode characters" IS a defect in today's code.

- If a defect in today's code could break it → the promise is **falsable**. Mark ✅.
- If it can ONLY be broken by writing NEW functionality that contradicts it → the promise is **architecturally tautological**. Mark `[TAUTOLOGICAL-ARCH — removed]` and do not generate a check.

**Chain-of-Thought requirement (show work):** For each promise, write one sentence completing: "The specific failure mechanism is: ______." The mechanism MUST name a concrete code path, module, or interaction that exists in the system today. If you cannot fill the blank without inventing code that does not exist, the promise is tautological.

### Coverage Preservation Rule

Whenever a promise or check is invalidated for ANY reason — tautology (logical or architectural), platform pre-filter, MECE de-duplication, or author-provided de-duplication — verify that the affected Actor × Category cell still has at least one covering check (algorithm-derived or author-provided). If the cell is now empty:

1. Attempt to identify a DIFFERENT promise for that same Actor × Category that is NOT tautological, NOT redundant with existing checks, and NOT a subset of a platform constraint.
2. If found → generate the replacement promise and apply the full Falsability Sweep to it.
3. If no valid replacement exists → mark the cell "N/A — [one-sentence justification]." This is acceptable; not every cell must have a check.

This rule applies at the point of invalidation, not deferred to the CE pass.

### Dependency Discovery

While filling the matrix, you will identify external services the subject depends on (databases, hosting, caches, external APIs). List each as a **Dependency** actor. Apply the same 5-category matrix to each Dependency.

**Exception:** If a platform was already processed during Platform Constraint Extraction in Step 0, do NOT add it as a Dependency actor. Its constraints are already accounted for as pre-filters. Adding it as a Dependency would generate an entire 5-category matrix of cells that are all pre-filtered or N/A — pure token waste.

Then resolve **GATE 2**:

- **G2-CELLS:** Count filled cells (including "Not applicable") out of total (actors × 5). ALL cells must be filled. If any is empty → fill it.
- **G2-FALSABILITY:** Did every promise receive the falsability test? If any lacks it → apply the test.
- **G2-TAUTOLOGY-PURGE:** Record count of tautological promises removed, broken down: logical (guaranteed by lower layer) / architectural (guaranteed by system's own observable design). Both types are valid purges.
- **G2-DEP-DISCOVERED:** List Dependencies discovered, or "none."
- **G2-DEP-MATRIXED:** If Dependencies were discovered, did each receive the 5-category matrix? If not → apply it.
- **G2-DISTRIBUTION:** Record the actor with the most promises and the actor with the fewest. This is informational, not blocking.

Mark each ✅ or ❌. Resolve all ❌ before proceeding.

---

## STEP 4: Phase 3 — Observable Mapping

For each promise that survived Phase 2 (not tautological, not "Not applicable"), define the **observable:**

> As a blind external observer who can only interact with the subject through its public interfaces: What is the MINIMUM action to perform, and what result confirms the promise is kept?

### Quality Sweep (apply to every observable)

1. **Externality:** Verifiable without source code, SSH, or direct database access? If not → reclassify to Dependency or Operator actor.
2. **Determinism:** Uses precise, measurable terms? Terms like "works correctly," "loads fast," "looks right" are PROHIBITED. Replace with specific criteria (status code, content match, response time threshold).
3. **Independence:** Does not require another check to have run first? If it does → restructure to be standalone.
4. **Minimality:** Is this the smallest action that verifies the promise? If a single request suffices, do not describe a multi-step workflow.

Then resolve **GATE 3**:

- **G3-COVERAGE:** Count of promises with observables / total surviving promises. If any promise lacks an observable → create one.
- **G3-EXTERNALITY:** All observables verifiable without internal access? If any requires internal access → reclassify.
- **G3-DETERMINISM:** All observables use precise terms? If any is vague → rewrite.
- **G3-INDEPENDENCE:** No observable depends on another? If any does → restructure.
- **G3-MINIMALITY:** All observables are minimal? If any is over-specified → simplify.

Mark each ✅ or ❌. Resolve all ❌ before proceeding.

---

## STEP 5: Phase 4 — Check Synthesis

For each observable, produce a check. In the **working document**, use the structured format for traceability:

```
[ACTOR-CATEGORY-NNN] Action → Expected Result (Promise being validated)
```

Where:
- ACTOR = short identifier for the actor (e.g., PUB, USR, API, ADM, OPS, DEP, ART — choose identifiers that are unambiguous within this checklist)
- CATEGORY = AVAIL | FUNC | CORR | INTEG | RESIL
- NNN = sequential number within that actor-category pair

Note: this structured ID format is for the WORKING document only. The clean document uses a different, human-readable format (see Step 8).

### Atomicity Test (apply to EVERY check — show work)

For each check, evaluate and record all three conditions:

1. **Singular Action:** Is the action expressible as ONE interaction (one request, one click, one observation)? If the action contains sequential steps ("do A, then B, then verify C") → ❌.
2. **Singular Result:** Is the expected result ONE comparison (one status code, one value, one state)? If the result contains multiple conditions joined by "and" → ❌.
3. **Implicit Diagnosis:** If this check fails, would a debugger know exactly where to look without asking "which part failed?" If the failure is ambiguous → ❌.

**If any condition shows ❌:** The check is **compound**. Decompose it:
- What specific promise does this check try to verify? (mini Phase 0)
- What sub-promises does it contain? (mini Phase 2)
- Synthesize atomic sub-checks, one per sub-promise.
- Re-apply the atomicity test to each sub-check.
- Stop decomposing when sub-checks either satisfy all three conditions OR further decomposition would produce tautological checks (falsability floor).

**Anti-decomposition rule:** Do NOT decompose a check when all resulting sub-checks would share the same triggering action AND the same failure diagnosis. If running the check and finding a failure always points the developer to the same system regardless of which sub-condition failed, decomposition adds noise without diagnostic value. Instead, keep a single check whose expected result lists the specific items. Example: "Run build → output contains index.html, JS bundles, WASM binary, and template files" is ONE check, not four — failing any item points to the same build configuration.

### Source Code Tagging (only if code is available)

For every check that could ONLY have been derived from reading source code — not from the text description alone — append `[CODE-DERIVED]`.

Then resolve **GATE 4**:

- **G4-FORMAT:** Every check in the working document uses the `[ACTOR-CATEGORY-NNN]` format? If any doesn't → fix it. (The clean document will use a different format — that conversion happens in Step 8.)
- **G4-ATOMICITY:** Every check shows three ✅ in the atomicity test? If any shows ❌ → decompose it. Record compound checks that were decomposed and their resulting sub-checks.
- **G4-CODE-DERIVED:** (Only if code was available) Count of `[CODE-DERIVED]` checks ≥ 1? If 0 → re-read source code and identify at least one check derivable only from implementation details.
- **G4-DENSITY:** Check density bounds (Excluding Author-Provided Checks): (1) Total algorithmically *derived* checks must be between 16 and 80. (2) Each individual actor MUST have between 8 and 16 *derived* checks. Do NOT count author-provided checks towards these minimums! If an actor falls below 8 derived checks → return to Phase 2, re-read the Domain Knowledge, and apply Dimensionality Expansion to split their generic functionality into specific promises. If an actor exceeds 16 derived checks → consolidate overlapping promises or evaluate if checks violate the anti-decomposition rule.

Mark each ✅ or ❌. Resolve all ❌ before proceeding.

---

## STEP 6: Phase 5 — MECE Audit

### Pass 1: Mutual Exclusivity (ME)

Examine pairs of checks that meet ANY of these criteria:
- Both are in the same Actor × Category cell, OR
- Both touch the same endpoint/interface, OR
- Both verify a property of the same output artifact from different actors

For each pair: do they verify the EXACT same observable property? If yes → keep the more direct one, remove the other. Record each pair examined and the resolution (kept/removed/both kept with justification). After each removal, apply the Coverage Preservation Rule.

**Cross-actor redundancy on shared artifacts (show work):** When two checks from different actors verify the same property of the same output artifact, and no transformation occurs between those perspectives, the check is redundant. Keep it under the actor whose perspective it most directly serves:
- If the property is about the artifact's fitness for the RECEIVER → keep it under Artifact Consumer.
- If the property is about the PRODUCER's output quality → keep it under Consumer.
- Remove from the other actor. Record the resolution. Apply the Coverage Preservation Rule.

### Pass 3: Author-Provided De-duplication

Compare every algorithm-derived check against the Author-Provided Checks extracted in Step 0. If an algorithm-derived check verifies the SAME observable behavior as an author-provided check, remove the algorithm-derived check. The author-provided check takes precedence. Record each comparison and resolution. After each removal, apply the Coverage Preservation Rule.

### Pass 2: Collective Exhaustivity (CE)

Draw the full Actor × Category matrix. Each cell contains either the check IDs that cover it, or "N/A — [reason]."

```
| Actor | AVAIL | FUNC | CORR | INTEG | RESIL |
|-------|-------|------|------|-------|-------|
| ...   | ...   | ...  | ...  | ...   | ...   |
```

Any cell that is empty without N/A justification is a **coverage gap**. Create the missing checks (return to Phase 4 as needed).

Then resolve **GATE 5**:

- **G5-ME-PAIRS:** List of pairs examined with resolution. If zero pairs were examined → examine at minimum all checks sharing an endpoint.
- **G5-CE-MATRIX:** Is the coverage matrix drawn and fully populated? If not → draw it.
- **G5-CE-NO-GAPS:** Any empty cells without N/A? If yes → fill the gaps.
- **G5-AUDIT-DELTA:** Declare changes: [+N added, -N removed, ~N modified]. Can be +0 -0 ~0, but must be stated.

Mark each ✅ or ❌. Resolve all ❌ before proceeding.

---

## STEP 7: Output Validation

Fill this summary table. Each row cites the gate that guarantees it:

| Criterion | Status | Guaranteed by |
|---|---|---|
| Traceability | ☐ | G4-FORMAT |
| Externality | ☐ | G3-EXTERNALITY |
| Coverage | ☐ | G5-CE-NO-GAPS |
| Diagnostic Isolation | ☐ | G4-ATOMICITY |
| Atomicity | ☐ | G4-ATOMICITY |
| Minimum Density | ☐ | G4-DENSITY |

If any shows FAIL → the cited gate was not properly resolved. Return and fix it.

---

## STEP 8: Cleanup and Delivery

When the Output Validation table shows ALL PASS:

1. Create the **clean document** as a NEW, SEPARATE artifact (named `[subject]_checklist.md`) using the `write_to_file` tool with `IsArtifact: true`. Do NOT edit the working document — leave it intact as the audit trail.

2. **Language:** The clean document MUST be written in the same language as the user's input. If the user wrote in Spanish, the clean document is in Spanish. If in English, in English.

3. The clean document contains ONLY these sections, in this order:

   **a. System Identity** — The purpose sentence. Nothing else.

   **b. Actors** — List of actors with full name and type (Consumer, Artifact Consumer, Contributor, Operator, Dependency). Preserve `[INFERRED]` tags where applied.

   **c. Author-Provided Checks** — The verification criteria extracted verbatim from the input in Step 0, reformatted into the same human-readable check format. These are labeled `[AUTHOR]` instead of a sequential number. This section appears ONLY if author-provided checks were found.

   **d. Derived Verification Checklist** — All algorithm-derived checks organized by actor, after de-duplication against author-provided checks. Each check uses this human-readable format:

   ```
   - **[Actor Name.NN] Natural-language title describing the promise.**
     Action → Expected result.
   ```

   Rules for this format:
   - The ID uses the actor's FULL NAME (not an abbreviation) + a sequential number: `[Author.01]`, `[Recipient.01]`, `[Typst Compiler.01]`.
   - The title is a SHORT sentence in natural language describing WHAT is being verified. It should be understandable by someone who has never seen the system.
   - The action → expected result pair is on a SEPARATE indented line. It is the concrete verification step.
   - `[CODE-DERIVED]` is appended after the action line if applicable.
   - The category (AVAIL/FUNC/CORR/INTEG/RESIL) does NOT appear in the ID — it lives only in the Coverage Matrix.

   **e. Coverage Matrix** — The Actor × Category table covering BOTH author-provided and derived checks. Use the sequential numbers from the clean IDs and `[A]` for author-provided checks. Column headers use full words, not abbreviations.

4. The clean document must contain **NONE** of the following: gate blocks, guardrail tables, status markers (✅/❌/☐), reasoning notes, counts, derivation work, atomicity verification records, audit pair lists, references to this workflow, recommendations, assessments, strategic observations, or internal category abbreviations (AVAIL, FUNC, CORR, INTEG, RESIL).

5. Present the clean document to the user as the deliverable.

---

## §T — TEMPLATE

Copy the following into your working document at the start. Fill it in as you execute each step.

---

<!-- TEMPLATE START -->

# Verification Checklist — [Subject Name]

> Derived using the Promise Decomposition Algorithm

---

## Input Classification

- **Text input:** [pending]
- **Code available:** [pending]
- **Documentation available:** [pending]

### Domain Knowledge

[pending or "None found"]

### Author-Provided Checks (verbatim)

[pending or "None found"]

### Platform Constraints

[pending or "None found"]

**⛔ GATE 0-INPUT**

| ID | Status | Notes |
|---|---|---|
| G0-IN-DOMAIN | ☐ | |
| G0-IN-AUTHOR | ☐ | |
| G0-IN-PLATFORM | ☐ | |

---

## System Identity

[pending]

**⛔ GATE 0**

| ID | Status | Notes |
|---|---|---|
| G0-TECH | ☐ | |
| G0-BENEFICIARY | ☐ | |
| G0-AGNOSTIC | ☐ | |

---

## Actor Discovery

### Derivation

**Verbs:** [pending]
**Subjects/Objects:** [pending]

### Actor List

| # | Actor | Type | Interacts with |
|---|---|---|---|
| 1 | [pending] | [pending] | INTERFACE / OUTPUT / BOTH |

**⛔ GATE 1**

| ID | Status | Notes |
|---|---|---|
| G1-DERIVATION | ☐ | |
| G1-MINIMUM-ACTORS | ☐ | Count: |
| G1-EXTERIOR | ☐ | |
| G1-NO-PREMATURE-DEP | ☐ | |
| G1-ARTIFACT-TEST | ☐ | |
| G1-CONSUMER-CHECK | ☐ | |

---

## Promise Matrix

### [Actor Name] ([Type])

| Category | Promise | Failure Mechanism | Falsable? |
|---|---|---|---|
| Availability | [pending] | [pending] | ☐ |
| Functionality | [pending] | [pending] | ☐ |
| Correctness | [pending] | [pending] | ☐ |
| Integrity | [pending] | [pending] | ☐ |
| Resilience | [pending] | [pending] | ☐ |

<!-- Repeat this table for each actor -->

**⛔ GATE 2**

| ID | Status | Notes |
|---|---|---|
| G2-CELLS | ☐ | /  |
| G2-FALSABILITY | ☐ | |
| G2-TAUTOLOGY-PURGE | ☐ | Count: |
| G2-DEP-DISCOVERED | ☐ | List: |
| G2-DEP-MATRIXED | ☐ | |
| G2-DISTRIBUTION | — | Max: / Min: |

---

## Observables

| Promise Ref | Observable Action | Expected Result |
|---|---|---|
| [Actor-Category] | [pending] | [pending] |

**⛔ GATE 3**

| ID | Status | Notes |
|---|---|---|
| G3-COVERAGE | ☐ | / |
| G3-EXTERNALITY | ☐ | |
| G3-DETERMINISM | ☐ | |
| G3-INDEPENDENCE | ☐ | |
| G3-MINIMALITY | ☐ | |

---

## Verification Checklist

- `[ACTOR-CATEGORY-NNN]` Action → Expected Result. *(Promise being validated.)*

### Atomicity Verification

| Check ID | Singular Action | Singular Result | Implicit Diagnosis | Verdict |
|---|---|---|---|---|
| [ID] | ☐ | ☐ | ☐ | ATOMIC / COMPOUND |

**⛔ GATE 4**

| ID | Status | Notes |
|---|---|---|
| G4-FORMAT | ☐ | |
| G4-ATOMICITY | ☐ | |
| G4-CODE-DERIVED | ☐ | Count: |
| G4-DENSITY | ☐ | Total: / Min: |

---

## MECE Audit

### ME Pairs Examined

| Pair | Same Promise? | Resolution |
|---|---|---|
| [ID-a] ↔ [ID-b] | YES/NO | Kept both / Removed [which] |

### Coverage Matrix

| Actor | AVAIL | FUNC | CORR | INTEG | RESIL |
|---|---|---|---|---|---|
| [name] | | | | | |

**⛔ GATE 5**

| ID | Status | Notes |
|---|---|---|
| G5-ME-PAIRS | ☐ | |
| G5-CE-MATRIX | ☐ | |
| G5-CE-NO-GAPS | ☐ | |
| G5-AUDIT-DELTA | ☐ | + / - / ~ |

---

## Output Validation

| Criterion | Status | Guaranteed by |
|---|---|---|
| Traceability | ☐ | G4-FORMAT |
| Externality | ☐ | G3-EXTERNALITY |
| Coverage | ☐ | G5-CE-NO-GAPS |
| Diagnostic Isolation | ☐ | G4-ATOMICITY |
| Atomicity | ☐ | G4-ATOMICITY |
| Minimum Density | ☐ | G4-DENSITY |

<!-- TEMPLATE END -->
