export type Product = {
  id: string;
  title: string;
  stageTag: string;
  isExploration?: boolean;
  problem: string;
  description: string;
  techTags: string[];
  icon: React.ReactNode;
  demoUrl: string;
};

export const products: Product[] = [
  {
    id: 'pulseguard',
    title: 'PulseGuard AI',
    stageTag: 'Production-grade build',
    problem: 'Social complaints escalate into PR crises before anyone on the CX team sees them.',
    description:
      'A 4-agent triage system (Sentinel → Triage → Resolver → Escalation) that watches X, Reddit, Trustpilot, and app stores for telecom CX, sanitizes PII, and routes what actually matters to a human through a clear escalation gate, keeping alert volume manageable for the team.',
    techTags: ['LangGraph', 'FastMCP', 'Redis Streams', 'FastAPI'],
    demoUrl: 'https://pulseguard-console.vercel.app/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 4.5 6v5.2c0 5 3.2 8.6 7.5 9.8 4.3-1.2 7.5-4.8 7.5-9.8V6z" />
        <line x1="12" y1="10" x2="12" y2="13.5" />
        <circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'call-intelligence',
    title: 'Telecom Call Intelligence',
    stageTag: 'Production-grade build',
    problem: 'Thousands of support calls happen every day and almost none of them turn into structured, usable intelligence.',
    description:
      'A 7-node LangGraph pipeline that extracts 70+ structured fields per call using a six-phase call-anatomy framework, validated against 50,000+ real transcripts — giving CX leaders QA and insight data automatically, at full call volume.',
    techTags: ['Haiku 4.5', 'NVIDIA NIM Llama 3.3', 'Streamlit', '364 tests'],
    demoUrl: 'https://telecom-call-intelligence.streamlit.app/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4h3l2 5-2 1.5a11 11 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2 2C10 21 3 14 3 6a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    id: 'signalharvest',
    title: 'SignalHarvest AI',
    stageTag: 'Multi-agent product build',
    problem: "Early market and complaint signals sit scattered across free public sources, unread until they're expensive.",
    description:
      'A 5-agent pipeline (Sentinel, Classifier, Scorer, Curator, Publisher) that harvests, scores, and curates signals from Reddit, Google Trends, and CFPB filings into a digest — so individuals and small teams get an early-warning system without paid monitoring tools.',
    techTags: ['LangGraph', 'PRAW', 'pytrends', 'CFPB API'],
    demoUrl: 'https://signalharvest-console.vercel.app/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12V6.5" />
        <path d="M8.5 12a3.5 3.5 0 0 1 7 0" />
        <path d="M5.5 12a6.5 6.5 0 0 1 13 0" />
        <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'cfpb',
    title: 'CFPB Credit Agreement Intelligence',
    stageTag: 'Production-grade demo',
    problem: 'Extracting terms from credit card agreements filed with regulators is still a manual, error-prone read-through.',
    description:
      'A Playwright-driven scraper feeding a two-pass extraction pipeline against a strict Pydantic schema, surfaced through a Streamlit UI — turning unstructured regulatory filings into clean, queryable data for compliance and fintech teams.',
    techTags: ['Playwright', 'Pydantic', 'Streamlit'],
    demoUrl: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v4h4" />
        <line x1="9.5" y1="12.5" x2="15" y2="12.5" />
        <line x1="9.5" y1="16" x2="15" y2="16" />
      </svg>
    ),
  },
  {
    id: 'rag-portfolio',
    title: 'Enterprise RAG Portfolio',
    stageTag: 'Production-grade portfolio',
    problem: 'Most RAG demos fall apart the moment real enterprise document mess shows up.',
    description:
      'Five production-grade RAG builds — HR Q&A, contract review, marketing content hub, hybrid-search tech docs, and a multi-agent IT helpdesk — run on Groq inference and local Ollama embeddings, proving the pattern across genuinely different document types.',
    techTags: ['Groq', 'Ollama', 'Hybrid Search'],
    demoUrl: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 3.5 8l8.5 5 8.5-5z" />
        <path d="M3.5 12l8.5 5 8.5-5" />
        <path d="M3.5 16l8.5 5 8.5-5" />
      </svg>
    ),
  },
  {
    id: 'founder-research',
    title: 'Founder Research Intelligence Engine',
    stageTag: 'In exploration',
    isExploration: true,
    problem: "Founders and operators need deep, current research on people and markets, but good research doesn't scale on a human analyst's time.",
    description:
      'An agentic research pipeline being evaluated as a retainer or report-based product — currently being tested against real client use cases before I commit build time to it.',
    techTags: ['Agentic Research', 'Concept Stage'],
    demoUrl: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <line x1="15.2" y1="15.2" x2="20" y2="20" />
      </svg>
    ),
  },
];
