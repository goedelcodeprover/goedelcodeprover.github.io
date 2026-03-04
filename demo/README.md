# Demo step pages

This folder defines the demo step content. Use Previous / Next on the main page to switch between steps.

- **step1.html** — Step 1: Problem (implementation + spec, theorem with sorry)
- **step2.html** — Step 2: Decomposition (sub-lemmas with sorry)
- **step3.html** — Step 3: Decomposition Part 2 (base lemmas + proofs of decomposed lemmas)
- **step4.html** — Step 4: Completion Part 1 (first three base lemma proofs)
- **step5.html** — Step 5: Completion Part 2 (last base lemma proof)

Edit the corresponding `stepN.html` to change that step’s content. Each file is an HTML fragment: a `<div class="demo-step-content">` with a title and `<pre class="demo-code"><code>...</code></pre>`. Do not include `<!DOCTYPE>` or `<html>`.
