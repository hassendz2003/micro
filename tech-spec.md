# Tech Spec — Calcul IFU Micro-importation

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | DOM rendering |
| tailwindcss | ^3.4.19 | Styling |
| lucide-react | ^0.460.0 | Icons (Calculator, RotateCcw, ChevronRight) |
| framer-motion | ^11.0.0 | Animations (fade, stagger, scale) |

All dependencies are pre-installed by the webapp-building init script except `framer-motion` which will be added.

---

## Component Inventory

### shadcn/ui Components

| Component | Usage |
|-----------|-------|
| Button | "Calculer" and "Réinitialiser" buttons |
| Input | Number input fields |
| Label | Input labels |

### Custom Components

| Component | Props | Description |
|-----------|-------|-------------|
| Header | — | Calculator icon + title + subtitle |
| InputForm | onCalculate, onReset | Two input fields + two buttons |
| CalculationSteps | steps: Step[] | Section title + 4 step cards |
| StepCard | step: Step, index: number | Individual step with number, formula, result |
| FinalResult | value: number | Orange-bordered result card |
| FooterBadge | — | "by Medo" floating badge |

### Types

```typescript
interface Step {
  number: number;
  formula: string;
  calculation: string;
  result: number;
}
```

---

## Animation Plan

| Animation | Library | Implementation | Complexity |
|-----------|---------|---------------|------------|
| Steps section fade-in | Framer Motion | `AnimatePresence` + `motion.div` with opacity 0→1, 400ms | Low |
| Step cards stagger | Framer Motion | `staggerChildren: 0.1` on container, each card `y: 10→0` + opacity | Low |
| Final result scale-in | Framer Motion | `scale: 0.95→1` + opacity, 300ms, triggered after steps | Low |
| Reset fade-out | Framer Motion | `AnimatePresence` exit animation, opacity 1→0, 200ms | Low |
| Input shake on error | Framer Motion | `animate` with x: [0, -4, 4, -4, 4, 0], duration 0.3s | Low |
| Button hover | Tailwind | `hover:brightness-110` / `hover:bg-[#1a2744]` | Low |

---

## State & Logic Plan

### State

```typescript
const [valeurA, setValeurA] = useState<string>("");
const [valeurB, setValeurB] = useState<string>("");
const [showResults, setShowResults] = useState<boolean>(false);
const [shakeInput, setShakeInput] = useState<"A" | "B" | null>(null);
```

### Calculation Logic

```typescript
const calculateSteps = (a: number, b: number): Step[] => {
  const step1 = a + b;
  const step2 = step1 * 0.3;
  const step3 = step2 + step1;
  const step4 = step3 * 0.005;

  return [
    { number: 1, formula: "A + B", calculation: `${a} + ${b}`, result: step1 },
    { number: 2, formula: "(A + B) × 30%", calculation: `${step1} × 0.3`, result: step2 },
    { number: 3, formula: "RESULT + (A + B)", calculation: `${step2.toFixed(2)} + ${step1}`, result: step3 },
    { number: 4, formula: "RESULT × 0.5%", calculation: `${step3.toFixed(2)} × 0.005`, result: step4 },
  ];
};
```

### Number Formatting

French format with space as thousands separator:
```typescript
const formatNumber = (n: number): string => {
  return n.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
};
```

### Event Handlers

- **handleCalculate**: Validate inputs → if valid, compute steps → setShowResults(true). If invalid, trigger shake on empty/invalid field.
- **handleReset**: Clear both inputs → setShowResults(false).

---

## Other Key Decisions

### No Router
Single-page application with no routing needed. All state is local.

### No Backend
Pure client-side calculation. No API calls or server required.

### Styling Strategy
Tailwind CSS with custom color tokens defined in `tailwind.config.js` (extend colors). All values from the design.md color palette will be added as custom theme colors.

### Accessibility
- Semantic HTML (form, label, input with proper associations)
- Focus-visible states on interactive elements
- Sufficient color contrast (verified in design)
- Disabled state on calculate button when inputs are empty
