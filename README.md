# Decompose and Conquer — project page

**Decompose and Conquer: Automated Code Verification in Lean 4 via Hierarchical Proof Search** (COLM 2026) project page. Style inspired by [zhouz.dev/RPC](https://zhouz.dev/RPC/) and [Goedel-Prover-V2](https://blog.goedel-prover.com/).

## Structure

- **`index.html`**: Single-page layout with nav, Hero (title / authors / links), Introduction, Demo, Our Methodology, Benchmark Performance, Footer.
- **`static/css/index.css`**: Custom styles (Bulma-based).
- Math uses **MathJax** (inline `\( ... \)`, display `\[ ... \]`).

## What to fill in

1. **Authors and affiliations**: In `index.html`, replace "Author One / Institution One" etc. with real names and institutions.
2. **Links**: Replace Paper, Code, Demo `href="#"` with actual URLs.
3. **Benchmark numbers**: Fill in the Benchmark Performance table with final results (currently placeholders).
4. **BibTeX**: Update the citation key and author list to the final version.

## Local preview and deployment

```bash
cd /Users/zenan/Github/Pages
python3 -m http.server 8000
```

Open http://localhost:8000 in your browser. To deploy: push the repo to GitHub and enable Pages, or bind a custom domain under Settings → Pages.
