import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0f1117",
  card: "#1a1d27",
  cardBorder: "#2a2d3a",
  accent1: "#6366f1", // indigo - SFT
  accent1Light: "#818cf8",
  accent2: "#f59e0b", // amber - RL
  accent2Light: "#fbbf24",
  accent3: "#10b981", // emerald - data
  accent3Light: "#34d399",
  accent4: "#ec4899", // pink - model
  accent4Light: "#f472b6",
  accent5: "#8b5cf6", // violet - compiler
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  connector: "#475569",
  glow1: "rgba(99, 102, 241, 0.3)",
  glow2: "rgba(245, 158, 11, 0.3)",
};

// Arrow marker SVG definition
const ArrowDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <defs>
      <marker id="arrow-gray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6" fill={COLORS.connector} />
      </marker>
      <marker id="arrow-indigo" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6" fill={COLORS.accent1} />
      </marker>
      <marker id="arrow-amber" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6" fill={COLORS.accent2} />
      </marker>
      <marker id="arrow-emerald" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6" fill={COLORS.accent3} />
      </marker>
      <marker id="arrow-violet" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6" fill={COLORS.accent5} />
      </marker>
    </defs>
  </svg>
);

// Animated node component
const Node = ({ x, y, width, height, label, sublabel, color, borderColor, visible, delay = 0, icon, glow, fontSize = 13, sublabelSize = 10 }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [visible, delay]);

  return (
    <g style={{
      opacity: show ? 1 : 0,
      transform: show ? "scale(1)" : "scale(0.85)",
      transformOrigin: `${x + width / 2}px ${y + height / 2}px`,
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    }}>
      {glow && (
        <rect x={x - 3} y={y - 3} width={width + 6} height={height + 6} rx={14}
          fill="none" stroke={glow} strokeWidth={4} opacity={0.5}
          style={{ filter: "blur(8px)" }} />
      )}
      <rect x={x} y={y} width={width} height={height} rx={12}
        fill={color || COLORS.card}
        stroke={borderColor || COLORS.cardBorder}
        strokeWidth={1.5} />
      {icon && (
        <text x={x + 14} y={y + height / 2 + (sublabel ? -4 : 1)} fontSize={16} dominantBaseline="middle">
          {icon}
        </text>
      )}
      <text
        x={x + (icon ? 36 : width / 2)}
        y={y + (sublabel ? height / 2 - 5 : height / 2)}
        textAnchor={icon ? "start" : "middle"}
        dominantBaseline="middle"
        fill={COLORS.text}
        fontSize={fontSize}
        fontWeight={600}
        fontFamily="'Inter', 'SF Pro Display', system-ui, sans-serif"
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={x + (icon ? 36 : width / 2)}
          y={y + height / 2 + 12}
          textAnchor={icon ? "start" : "middle"}
          dominantBaseline="middle"
          fill={COLORS.textMuted}
          fontSize={sublabelSize}
          fontFamily="'Inter', system-ui, sans-serif"
        >
          {sublabel}
        </text>
      )}
    </g>
  );
};

// Animated connector line
const Connector = ({ points, visible, delay = 0, color = COLORS.connector, dashed = false, markerEnd = "arrow-gray" }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [visible, delay]);

  const d = points.length === 2
    ? `M${points[0][0]},${points[0][1]} L${points[1][0]},${points[1][1]}`
    : `M${points[0][0]},${points[0][1]} ${points.slice(1).map(p => `L${p[0]},${p[1]}`).join(" ")}`;

  return (
    <path d={d}
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeDasharray={dashed ? "6,4" : "none"}
      markerEnd={`url(#${markerEnd})`}
      style={{
        opacity: show ? 0.85 : 0,
        transition: "opacity 0.4s ease",
        transitionDelay: `${delay}ms`,
      }}
    />
  );
};

// Animated badge/pill
const Badge = ({ x, y, text, color, visible, delay = 0 }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [visible, delay]);

  const w = text.length * 7 + 20;
  return (
    <g style={{ opacity: show ? 1 : 0, transition: "opacity 0.4s ease" }}>
      <rect x={x - w / 2} y={y - 10} width={w} height={20} rx={10}
        fill={color} opacity={0.15} />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={10} fontWeight={600}
        fontFamily="'Inter', system-ui, sans-serif">
        {text}
      </text>
    </g>
  );
};

// Section title
const SectionTitle = ({ x, y, text, color, visible, delay = 0, subtitle }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [visible, delay]);

  return (
    <g style={{ opacity: show ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <rect x={x - 2} y={y - 1} width={4} height={22} rx={2} fill={color} />
      <text x={x + 12} y={y + 10} dominantBaseline="middle"
        fill={color} fontSize={18} fontWeight={700}
        fontFamily="'Inter', 'SF Pro Display', system-ui, sans-serif">
        {text}
      </text>
      {subtitle && (
        <text x={x + 12} y={y + 28} dominantBaseline="middle"
          fill={COLORS.textDim} fontSize={11}
          fontFamily="'Inter', system-ui, sans-serif">
          {subtitle}
        </text>
      )}
    </g>
  );
};

// Divider
const Divider = ({ y, visible, delay = 0 }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [visible, delay]);
  return (
    <line x1={30} y1={y} x2={920} y2={y}
      stroke={COLORS.cardBorder}
      strokeWidth={1}
      strokeDasharray="4,6"
      style={{ opacity: show ? 0.5 : 0, transition: "opacity 0.5s ease" }} />
  );
};

const STEPS = [
  { label: "Overview", desc: "Training Pipeline Overview" },
  { label: "Data", desc: "Data Curation" },
  { label: "SFT", desc: "Supervised Fine-Tuning" },
  { label: "RL", desc: "Hybrid Reinforcement Learning" },
  { label: "Full", desc: "Complete Pipeline" },
];

export default function TrainingPipeline() {
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    if (step >= STEPS.length - 1) { setAutoPlay(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), 3000);
    return () => clearTimeout(t);
  }, [step, autoPlay]);

  const svgW = 950;
  const svgH = 680;

  // Visibility helpers
  const vis = (minStep) => step >= minStep;

  return (
    <div style={{
      background: COLORS.bg,
      borderRadius: 16,
      padding: "24px 16px 16px",
      fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
      maxWidth: 1000,
      margin: "0 auto",
    }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{ color: COLORS.text, margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
          Training Pipeline
        </h2>
        <p style={{ color: COLORS.textDim, margin: "4px 0 0", fontSize: 13 }}>
          Supervised Initialization → Hybrid Reinforcement Learning
        </p>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            style={{
              background: step === i
                ? (i <= 2 ? COLORS.accent1 : COLORS.accent2)
                : step > i ? (i <= 2 ? "rgba(99,102,241,0.2)" : "rgba(245,158,11,0.2)") : COLORS.card,
              color: step >= i ? COLORS.text : COLORS.textDim,
              border: `1px solid ${step === i ? "transparent" : COLORS.cardBorder}`,
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 12,
              fontWeight: step === i ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}>
            {s.label}
          </button>
        ))}
        <button onClick={() => { setStep(0); setAutoPlay(true); }}
          style={{
            background: autoPlay ? COLORS.accent3 : "transparent",
            color: autoPlay ? COLORS.text : COLORS.textMuted,
            border: `1px solid ${autoPlay ? COLORS.accent3 : COLORS.cardBorder}`,
            borderRadius: 20,
            padding: "6px 12px",
            fontSize: 12,
            cursor: "pointer",
            marginLeft: 8,
          }}>
          {autoPlay ? "▶ Playing" : "▶ Auto"}
        </button>
      </div>

      {/* SVG Diagram */}
      <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%"
        style={{ background: COLORS.bg, borderRadius: 12 }}>
        <ArrowDefs />

        {/* ═══════════ STAGE 1: DATA CURATION ═══════════ */}
        <SectionTitle x={40} y={15} text="Stage 1: Supervised Fine-Tuning (SFT)"
          subtitle="Distill frontier model capabilities into a unified policy"
          color={COLORS.accent1} visible={vis(0)} delay={0} />

        {/* Formal Problems */}
        <Node x={40} y={65} width={140} height={60}
          label="Formal Problems" sublabel="LeetCode + OpenCodeInstruct"
          color="rgba(100,116,139,0.2)" borderColor="#475569"
          icon="📋" visible={vis(1)} delay={100} fontSize={12} />
        <Badge x={110} y={138} text="~5K problems" color={COLORS.textMuted}
          visible={vis(1)} delay={200} />

        {/* Arrow to decompose */}
        <Connector points={[[180, 95], [220, 95]]} visible={vis(1)} delay={300} />

        {/* GPT Lemma-Decompose */}
        <Node x={220} y={55} width={165} height={48}
          label="Lemma-Decompose" sublabel="GPT-Curated · depth=128 · width=8"
          color="rgba(99,102,241,0.12)" borderColor={COLORS.accent1}
          visible={vis(1)} delay={400} glow={vis(2) ? COLORS.glow1 : null} fontSize={12} sublabelSize={9} />

        {/* Arrows from decompose */}
        <Connector points={[[385, 70], [440, 55]]} visible={vis(2)} delay={100}
          color={COLORS.accent1} markerEnd="arrow-indigo" />
        <Connector points={[[385, 90], [440, 130]]} visible={vis(2)} delay={200}
          color={COLORS.accent1} markerEnd="arrow-indigo" />

        {/* Decomposition trajectories */}
        <Node x={440} y={35} width={190} height={42}
          label="Decomposition Trajectories" sublabel="input-output pairs"
          color="rgba(245,158,11,0.1)" borderColor={COLORS.accent2}
          visible={vis(2)} delay={200} fontSize={11} sublabelSize={9} />
        <Badge x={535} y={88} text="~281K" color={COLORS.accent2}
          visible={vis(2)} delay={350} />

        {/* Decomposed Lemmas */}
        <Node x={440} y={110} width={190} height={42}
          label="Decomposed Lemmas" sublabel="intermediate sub-goals"
          color="rgba(16,185,129,0.1)" borderColor={COLORS.accent3}
          visible={vis(2)} delay={300} fontSize={11} sublabelSize={9} />
        <Badge x={535} y={163} text="~29K" color={COLORS.accent3}
          visible={vis(2)} delay={450} />

        {/* Arrow from decomposed lemmas down to completion */}
        <Connector points={[[535, 152], [535, 180], [300, 180], [300, 195]]}
          visible={vis(2)} delay={400} color={COLORS.accent3} markerEnd="arrow-emerald" />

        {/* Gemini Completion */}
        <Node x={215} y={190} width={170} height={48}
          label="Lemma-Completion" sublabel="Gemini-Curated · depth=20 · width=8"
          color="rgba(236,72,153,0.1)" borderColor={COLORS.accent4}
          visible={vis(2)} delay={500} fontSize={12} sublabelSize={9} />

        {/* Arrow from completion to trajectories */}
        <Connector points={[[385, 214], [440, 214]]}
          visible={vis(2)} delay={600} color={COLORS.accent4} markerEnd="arrow-gray" />

        {/* Completion trajectories */}
        <Node x={440} y={192} width={190} height={42}
          label="Completion Trajectories" sublabel="input-output pairs"
          color="rgba(245,158,11,0.1)" borderColor={COLORS.accent2}
          visible={vis(2)} delay={650} fontSize={11} sublabelSize={9} />
        <Badge x={535} y={246} text="~18K" color={COLORS.accent2}
          visible={vis(2)} delay={750} />

        {/* Data decontamination label */}
        <g style={{
          opacity: vis(2) ? 0.7 : 0,
          transition: "opacity 0.5s ease",
        }}>
          <rect x={442} y={260} width={130} height={22} rx={4}
            fill="none" stroke={COLORS.textDim} strokeWidth={1} strokeDasharray="3,3" />
          <text x={507} y={273} textAnchor="middle" dominantBaseline="middle"
            fill={COLORS.textDim} fontSize={9} fontFamily="'Inter', system-ui, sans-serif">
            + data de-contamination
          </text>
        </g>

        {/* Arrows to SFT model */}
        <Connector points={[[630, 56], [710, 56], [710, 155], [750, 155]]}
          visible={vis(2)} delay={800} color={COLORS.accent2} markerEnd="arrow-amber" />
        <Connector points={[[630, 213], [710, 213], [710, 175], [750, 175]]}
          visible={vis(2)} delay={900} color={COLORS.accent2} markerEnd="arrow-amber" />

        {/* SFT-S1 Model */}
        <Node x={750} y={120} width={160} height={75}
          label="SFT-S1 Model" sublabel="Qwen3-8B backbone"
          color="rgba(99,102,241,0.15)" borderColor={COLORS.accent1Light}
          visible={vis(2)} delay={1000} glow={COLORS.glow1} fontSize={14} />
        <g style={{ opacity: vis(2) ? 1 : 0, transition: "opacity 0.5s ease", transitionDelay: "1100ms" }}>
          <text x={830} y={182} textAnchor="middle" fill={COLORS.textDim} fontSize={9}
            fontFamily="'Inter', system-ui, sans-serif">
            decomposition + completion
          </text>
        </g>

        {/* ═══════════ DIVIDER ═══════════ */}
        <Divider y={310} visible={vis(3)} delay={0} />

        {/* ═══════════ STAGE 2: RL ═══════════ */}
        <SectionTitle x={40} y={325} text="Stage 2: Hybrid Reinforcement Learning"
          subtitle="On-policy GRPO for decomposition + Off-policy SFT for completion"
          color={COLORS.accent2} visible={vis(3)} delay={100} />

        {/* SFT-S1 Model (left) */}
        <Node x={40} y={385} width={140} height={65}
          label="SFT-S1 Model" sublabel="unified policy π"
          color="rgba(99,102,241,0.15)" borderColor={COLORS.accent1Light}
          visible={vis(3)} delay={200} glow={COLORS.glow1} fontSize={13} />

        {/* Arrow to Decompose diamond */}
        <Connector points={[[180, 417], [230, 417]]}
          visible={vis(3)} delay={400} color={COLORS.accent1} markerEnd="arrow-indigo" />

        {/* Decompose diamond shape */}
        <g style={{
          opacity: vis(3) ? 1 : 0,
          transform: vis(3) ? "scale(1)" : "scale(0.8)",
          transformOrigin: "265px 417px",
          transition: "all 0.5s ease",
          transitionDelay: "500ms",
        }}>
          <polygon points="265,392 300,417 265,442 230,417"
            fill={COLORS.accent5} opacity={0.3} stroke={COLORS.accent5} strokeWidth={1.5} />
          <text x={265} y={415} textAnchor="middle" dominantBaseline="middle"
            fill={COLORS.text} fontSize={10} fontWeight={600}
            fontFamily="'Inter', system-ui, sans-serif">
            Decompose
          </text>
          <text x={265} y={428} textAnchor="middle" dominantBaseline="middle"
            fill={COLORS.textMuted} fontSize={8}
            fontFamily="'Inter', system-ui, sans-serif">
            rollout
          </text>
        </g>

        {/* ── On-Policy branch (top) ── */}
        {/* Dashed region for on-policy */}
        <g style={{
          opacity: vis(3) ? 1 : 0,
          transition: "opacity 0.5s ease",
          transitionDelay: "600ms",
        }}>
          <rect x={320} y={360} width={580} height={105} rx={8}
            fill="none" stroke={COLORS.accent2} strokeWidth={1.2} strokeDasharray="6,4" opacity={0.3} />
          <text x={340} y={378} fill={COLORS.accent2} fontSize={11} fontWeight={600} opacity={0.7}
            fontFamily="'Inter', system-ui, sans-serif">
            On-Policy (GRPO)
          </text>
        </g>

        {/* Arrow from decompose to decomposition trajectories */}
        <Connector points={[[300, 405], [365, 405]]}
          visible={vis(3)} delay={700} color={COLORS.accent2} markerEnd="arrow-amber" />

        {/* Decomposition trajectories */}
        <Node x={365} y={388} width={175} height={38}
          label="Decomposition Trajectories" sublabel=""
          color="rgba(245,158,11,0.1)" borderColor={COLORS.accent2}
          visible={vis(3)} delay={750} fontSize={11} />

        {/* Arrow to compiler */}
        <Connector points={[[540, 407], [600, 407]]}
          visible={vis(3)} delay={850} color={COLORS.accent2} markerEnd="arrow-amber" />

        {/* Compiler diamond */}
        <g style={{
          opacity: vis(3) ? 1 : 0,
          transform: vis(3) ? "scale(1)" : "scale(0.8)",
          transformOrigin: "640px 407px",
          transition: "all 0.5s ease",
          transitionDelay: "900ms",
        }}>
          <polygon points="640,385 672,407 640,429 608,407"
            fill={COLORS.accent5} opacity={0.4} stroke={COLORS.accent5} strokeWidth={1.5} />
          <text x={640} y={405} textAnchor="middle" dominantBaseline="middle"
            fill={COLORS.text} fontSize={9} fontWeight={600}
            fontFamily="'Inter', system-ui, sans-serif">
            Lean 4
          </text>
          <text x={640} y={418} textAnchor="middle" dominantBaseline="middle"
            fill={COLORS.textMuted} fontSize={8}
            fontFamily="'Inter', system-ui, sans-serif">
            Compiler
          </text>
        </g>

        {/* Arrow from compiler to GRPO */}
        <Connector points={[[672, 407], [730, 407]]}
          visible={vis(3)} delay={1000} color={COLORS.accent2} markerEnd="arrow-amber" />

        {/* GRPO Gradients */}
        <Node x={730} y={388} width={150} height={38}
          label="GRPO Gradients" sublabel=""
          color="rgba(245,158,11,0.15)" borderColor={COLORS.accent2}
          visible={vis(3)} delay={1050} glow={COLORS.glow2} fontSize={12} />

        {/* Reward label */}
        <g style={{ opacity: vis(3) ? 1 : 0, transition: "opacity 0.4s ease", transitionDelay: "1100ms" }}>
          <text x={805} y={436} textAnchor="middle" fill={COLORS.accent2} fontSize={9} fontStyle="italic"
            fontFamily="'Inter', system-ui, sans-serif">
            reward = decomposition score R
          </text>
          <text x={805} y={449} textAnchor="middle" fill={COLORS.textDim} fontSize={8}
            fontFamily="'Inter', system-ui, sans-serif">
            (continuous, dense signal)
          </text>
        </g>

        {/* ── Off-Policy branch (bottom) ── */}
        <g style={{
          opacity: vis(3) ? 1 : 0,
          transition: "opacity 0.5s ease",
          transitionDelay: "1200ms",
        }}>
          <rect x={320} y={480} width={580} height={105} rx={8}
            fill="none" stroke={COLORS.accent4} strokeWidth={1.2} strokeDasharray="6,4" opacity={0.3} />
          <text x={340} y={498} fill={COLORS.accent4} fontSize={11} fontWeight={600} opacity={0.7}
            fontFamily="'Inter', system-ui, sans-serif">
            Off-Policy (SFT Replay)
          </text>
        </g>

        {/* Arrow from decompose down to decomposed lemmas */}
        <Connector points={[[265, 442], [265, 520], [365, 520]]}
          visible={vis(3)} delay={1300} color={COLORS.accent3} markerEnd="arrow-emerald" />

        {/* Decomposed Lemmas */}
        <Node x={365} y={502} width={155} height={38}
          label="Decomposed Lemmas" sublabel=""
          color="rgba(16,185,129,0.1)" borderColor={COLORS.accent3}
          visible={vis(3)} delay={1350} fontSize={11} />

        {/* Arrow to Gemini completion */}
        <Connector points={[[520, 521], [570, 521]]}
          visible={vis(3)} delay={1400} color={COLORS.accent3} markerEnd="arrow-emerald" />

        {/* Gemini completion */}
        <Node x={570} y={502} width={165} height={38}
          label="Gemini Completion" sublabel="teacher model · depth=20"
          color="rgba(100,116,139,0.15)" borderColor="#64748b"
          visible={vis(3)} delay={1450} fontSize={11} sublabelSize={9} />

        {/* Arrow to SFT gradients */}
        <Connector points={[[735, 521], [775, 521]]}
          visible={vis(3)} delay={1500} color={COLORS.accent4} markerEnd="arrow-gray" />

        {/* SFT Gradients */}
        <Node x={730} y={502} width={150} height={38}
          label="SFT Gradients" sublabel=""
          color="rgba(236,72,153,0.12)" borderColor={COLORS.accent4}
          visible={vis(3)} delay={1550} fontSize={12} />
        <g style={{ opacity: vis(3) ? 1 : 0, transition: "opacity 0.4s ease", transitionDelay: "1600ms" }}>
          <text x={805} y={550} textAnchor="middle" fill={COLORS.accent4} fontSize={9} fontStyle="italic"
            fontFamily="'Inter', system-ui, sans-serif">
            stabilize completion ability
          </text>
          <text x={805} y={563} textAnchor="middle" fill={COLORS.textDim} fontSize={8}
            fontFamily="'Inter', system-ui, sans-serif">
            (high-quality replay)
          </text>
        </g>

        {/* Gradient merge arrows back to model */}
        {/* GRPO arrow going back */}
        <Connector points={[[805, 388], [805, 355], [110, 355], [110, 385]]}
          visible={vis(3)} delay={1700} color={COLORS.accent2} markerEnd="arrow-amber" dashed />
        {/* SFT arrow going back */}
        <Connector points={[[805, 540], [890, 540], [890, 590], [110, 590], [110, 450]]}
          visible={vis(3)} delay={1800} color={COLORS.accent4} markerEnd="arrow-gray" dashed />

        {/* Combined loss label */}
        <g style={{
          opacity: vis(3) ? 1 : 0,
          transition: "opacity 0.5s ease",
          transitionDelay: "1900ms",
        }}>
          <rect x={20} y={457} width={180} height={32} rx={6}
            fill="rgba(245,158,11,0.08)" stroke={COLORS.accent2} strokeWidth={1} opacity={0.7} />
          <text x={110} y={471} textAnchor="middle" dominantBaseline="middle"
            fill={COLORS.text} fontSize={10} fontWeight={600}
            fontFamily="'Inter', 'SF Mono', monospace">
            𝒥 = 𝒥_GRPO + λ · 𝒥_SFT
          </text>
          <text x={110} y={500} textAnchor="middle" fill={COLORS.textDim} fontSize={8}
            fontFamily="'Inter', system-ui, sans-serif">
            + online lemma augmentation
          </text>
        </g>

        {/* ═══════════ FINAL MODEL (step 4) ═══════════ */}
        <g style={{
          opacity: vis(4) ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}>
          <rect x={330} y={620} width={300} height={46} rx={12}
            fill="rgba(16,185,129,0.12)" stroke={COLORS.accent3} strokeWidth={2} />
          <text x={480} y={638} textAnchor="middle" dominantBaseline="middle"
            fill={COLORS.accent3Light} fontSize={15} fontWeight={700}
            fontFamily="'Inter', 'SF Pro Display', system-ui, sans-serif">
            Final Unified Policy
          </text>
          <text x={480} y={655} textAnchor="middle" dominantBaseline="middle"
            fill={COLORS.textMuted} fontSize={10}
            fontFamily="'Inter', system-ui, sans-serif">
            decomposition + completion · Qwen3-8B
          </text>
        </g>
        <Connector points={[[110, 450], [110, 640], [330, 640]]}
          visible={vis(4)} delay={200} color={COLORS.accent3} markerEnd="arrow-emerald" dashed />
      </svg>

      {/* Step description */}
      <div style={{
        textAlign: "center",
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 12,
        padding: "8px 16px",
        background: COLORS.card,
        borderRadius: 8,
      }}>
        Step {step + 1}/{STEPS.length}: <span style={{ color: COLORS.text }}>{STEPS[step].desc}</span>
        {step < STEPS.length - 1 && (
          <span style={{ color: COLORS.textDim }}> — click next step or press ▶ Auto</span>
        )}
      </div>
    </div>
  );
}
