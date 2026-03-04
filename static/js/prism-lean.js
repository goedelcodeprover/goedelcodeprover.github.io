import { useState } from "react";

const LEAN4_SAMPLE = `-- commutativity of addition on Nat
theorem add_comm (n m : Nat) : n + m = m + n := by
  induction n with
  | zero => simp
  | succ k ih =>
      rw [Nat.succ_add, ih]
      rfl

-- length of list append
lemma length_append (xs ys : List α) :
    (xs ++ ys).length = xs.length + ys.length := by
  induction xs with
  | nil => simp
  | cons x xs ih => simp [ih, Nat.add_assoc]

-- classical propositional logic
example (p q : Prop) (hp : p) (hq : q) : p ∧ q :=
  ⟨hp, hq⟩

def fibonacci : Nat → Nat
  | 0 => 0
  | 1 => 1
  | n + 2 => fibonacci n + fibonacci (n + 1)`;

function tokenize(code) {
  const tokens = [];
  let i = 0;
  while (i < code.length) {
    // comment
    if (code[i] === '-' && code[i+1] === '-') {
      let j = i;
      while (j < code.length && code[j] !== '\n') j++;
      tokens.push({ type: 'comment', value: code.slice(i, j) });
      i = j;
      continue;
    }
    // string
    if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length && code[j] !== '"') {
        if (code[j] === '\\') j++;
        j++;
      }
      tokens.push({ type: 'string', value: code.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    // number
    if (/\d/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\dxa-fA-F]/.test(code[j])) j++;
      tokens.push({ type: 'number', value: code.slice(i, j) });
      i = j;
      continue;
    }
    // identifier / keyword
    if (/[a-zA-Zα-ωΑ-Ωα_]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\w']/.test(code[j])) j++;
      const word = code.slice(i, j);
      const keywords = new Set(['lemma','theorem','def','instance','inductive','structure','class','namespace','section','end','variable','variables','open','import','export','abbrev','opaque','axiom','sorry','by','match','with','if','then','else','let','in','have','show','from','calc','rfl','where']);
      const tactics = new Set(['exact','apply','simp','intro','intros','cases','rcases','constructor','refine','by_contra','use','obtain','rewrite','rw','unfold','induction','split','left','right','repeat','try','done','fail','succ','zero','nil','cons']);
      const types = new Set(['Prop','Type','Int','Nat','List','Option','Bool','True','False','Eq','And','Or','Not','Unit','String','Char','Float','Array','Vector','α','β','γ']);
      if (keywords.has(word)) tokens.push({ type: 'keyword', value: word });
      else if (tactics.has(word)) tokens.push({ type: 'tactic', value: word });
      else if (types.has(word)) tokens.push({ type: 'type', value: word });
      else tokens.push({ type: 'ident', value: word });
      i = j;
      continue;
    }
    // operator / unicode
    if (/[→←⇒⇐↔∧∨¬∀∃≠≤≥∈∉⊆∪∩×·:=<>+\-*\/%|⟨⟩▸]/.test(code[i])) {
      tokens.push({ type: 'operator', value: code[i] });
      i++;
      continue;
    }
    // punctuation
    if (/[(){}\[\];.,|⟨⟩_]/.test(code[i])) {
      tokens.push({ type: 'punct', value: code[i] });
      i++;
      continue;
    }
    tokens.push({ type: 'plain', value: code[i] });
    i++;
  }
  return tokens;
}

const TOKEN_COLORS = {
  comment:  '#6e7a8a',
  string:   '#c9a96e',
  number:   '#e8a87c',
  keyword:  '#c678dd',
  tactic:   '#61afef',
  type:     '#56b6c2',
  operator: '#98c379',
  punct:    '#abb2bf',
  ident:    '#e5c07b',
  plain:    '#cdd6f4',
};

function HighlightedCode({ code }) {
  const lines = code.split('\n');
  return (
    <div style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '13.5px', lineHeight: '1.8' }}>
      {lines.map((line, li) => {
        const tokens = tokenize(line);
        return (
          <div key={li} style={{ display: 'flex', minHeight: '1.8em' }}>
            <span style={{
              minWidth: '2.8em',
              textAlign: 'right',
              paddingRight: '1.2em',
              color: '#3d4451',
              userSelect: 'none',
              fontSize: '11px',
              lineHeight: '1.8',
              fontVariantNumeric: 'tabular-nums',
            }}>{li + 1}</span>
            <span>
              {tokens.map((tok, ti) => (
                <span key={ti} style={{ color: TOKEN_COLORS[tok.type] || TOKEN_COLORS.plain }}>
                  {tok.value}
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const LEGEND = [
  { type: 'keyword',  label: 'Keyword',   example: 'theorem def' },
  { type: 'tactic',   label: 'Tactic',    example: 'simp rw induction' },
  { type: 'type',     label: 'Type',      example: 'Nat Prop List' },
  { type: 'operator', label: 'Operator',  example: '∧ ∨ → ∀ ∃' },
  { type: 'string',   label: 'String',   example: '"hello"' },
  { type: 'number',   label: 'Number',    example: '0 1 42' },
  { type: 'comment',  label: 'Comment',   example: '-- comment' },
  { type: 'ident',    label: 'Identifier', example: 'fibonacci xs' },
];

export default function App() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(LEAN4_SAMPLE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '48px 24px',
      fontFamily: '"Inter", system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '780px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
          <span style={{
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#c678dd',
            fontWeight: 600,
          }}>Theorem Prover</span>
          <span style={{ color: '#3d4451', fontSize: '11px' }}>·</span>
          <span style={{ fontSize: '11px', color: '#6e7a8a', letterSpacing: '0.08em' }}>Microsoft Research</span>
        </div>
        <h1 style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: 300,
          color: '#e5e9f0',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          Lean<span style={{ color: '#c678dd', fontWeight: 700 }}> 4</span>
          <span style={{ color: '#3d4451', fontWeight: 300, fontSize: '20px', marginLeft: '12px' }}>
            Syntax Highlight
          </span>
        </h1>
      </div>

      {/* Code block */}
      <div style={{
        width: '100%',
        maxWidth: '780px',
        background: '#161b22',
        borderRadius: '12px',
        border: '1px solid #21262d',
        overflow: 'hidden',
        boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
      }}>
        {/* Titlebar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          borderBottom: '1px solid #21262d',
          background: '#13171e',
        }}>
          <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
            <span style={{ marginLeft: '10px', color: '#6e7a8a', fontSize: '12px', letterSpacing: '0.04em' }}>
              theorems.lean
            </span>
          </div>
          <button
            onClick={handleCopy}
            style={{
              background: 'none',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: copied ? '#98c379' : '#6e7a8a',
              fontSize: '11px',
              padding: '4px 12px',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Code */}
        <div style={{ padding: '20px 8px 20px 0', overflowX: 'auto' }}>
          <HighlightedCode code={LEAN4_SAMPLE} />
        </div>
      </div>

      {/* Legend */}
      <div style={{
        width: '100%',
        maxWidth: '780px',
        marginTop: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
      }}>
        {LEGEND.map(({ type, label, example }) => (
          <div key={type} style={{
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: '8px',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}>
            <span style={{ fontSize: '10px', color: '#6e7a8a', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              color: TOKEN_COLORS[type],
            }}>{example}</span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: '32px', color: '#3d4451', fontSize: '11px', letterSpacing: '0.04em' }}>
        Based on Prism.js syntax rules · for Lean 4 theorem proving language
      </div>
    </div>
  );
}