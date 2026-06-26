import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, RotateCcw, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Step {
  number: number;
  formula: string;
  calculation: string;
  result: number;
}

function formatNumber(n: number): string {
  return n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
}

function calculateSteps(a: number, b: number): Step[] {
  const step1 = a + b;
  const step2 = step1 * 0.3;
  const step3 = step2 + step1;
  const step4 = step3 * 0.005;

  return [
    { number: 1, formula: 'A + B', calculation: `${a} + ${b}`, result: step1 },
    { number: 2, formula: '(A + B) \u00d7 30%', calculation: `${step1} \u00d7 0.3`, result: step2 },
    { number: 3, formula: 'RESULT + (A + B)', calculation: `${step2.toFixed(2)} + ${step1}`, result: step3 },
    { number: 4, formula: 'RESULT \u00d7 0.5%', calculation: `${step3.toFixed(2)} \u00d7 0.005`, result: step4 },
  ];
}

function Header() {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      <div className="w-12 h-12 rounded-[10px] bg-navy-result border border-navy-card-border flex items-center justify-center mb-5">
        <Calculator className="w-6 h-6 text-accent-orange" />
      </div>
      <h1 className="text-[28px] font-bold text-white leading-tight">
        calcul de l&apos;Impôt Forfaitaire Unique (IFU)
        <br />
        pour une activité de micro-importation
      </h1>
      <p className="text-sm text-muted-foreground mt-3 max-w-[360px]">
        Entrez les valeurs A et B pour voir le calcul étape par étape
      </p>
    </div>
  );
}

function InputForm({
  valeurA,
  valeurB,
  onValeurAChange,
  onValeurBChange,
  onCalculate,
  onReset,
  shakeA,
  shakeB,
}: {
  valeurA: string;
  valeurB: string;
  onValeurAChange: (v: string) => void;
  onValeurBChange: (v: string) => void;
  onCalculate: () => void;
  onReset: () => void;
  shakeA: boolean;
  shakeB: boolean;
}) {
  const isValid = valeurA.trim() !== '' && valeurB.trim() !== '';

  return (
    <div className="bg-navy-card border border-navy-card-border rounded-xl p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <motion.div
          animate={shakeA ? { x: [0, -4, 4, -4, 4, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Label htmlFor="valeur-a" className="text-sm text-white mb-2 block">
            valeur déclarée
          </Label>
          <Input
            id="valeur-a"
            type="number"
            placeholder="0"
            value={valeurA}
            onChange={(e) => onValeurAChange(e.target.value)}
            className="bg-navy-input border-navy-card-border text-white placeholder:text-muted-foreground focus:border-navy-step-text focus:ring-navy-step-text h-11"
          />
        </motion.div>
        <motion.div
          animate={shakeB ? { x: [0, -4, 4, -4, 4, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Label htmlFor="valeur-b" className="text-sm text-white mb-2 block">
            valeur de dédouanement
          </Label>
          <Input
            id="valeur-b"
            type="number"
            placeholder="0"
            value={valeurB}
            onChange={(e) => onValeurBChange(e.target.value)}
            className="bg-navy-input border-navy-card-border text-white placeholder:text-muted-foreground focus:border-navy-step-text focus:ring-navy-step-text h-11"
          />
        </motion.div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCalculate}
          disabled={!isValid}
          className="flex-1 flex items-center justify-center gap-2 bg-accent-orange text-white font-medium py-3.5 px-4 rounded-lg transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Calculator className="w-4 h-4" />
          Calculer
        </button>
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 bg-navy-result border border-navy-card-border text-white font-medium py-3.5 px-4 rounded-lg transition-all hover:bg-navy-card-border"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </button>
      </div>
    </div>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3, ease: 'easeOut' }}
      className="bg-navy-card border border-navy-card-border rounded-lg px-5 py-4 flex items-center gap-4"
    >
      <div className="w-9 h-9 rounded-full bg-navy-step-bg flex items-center justify-center flex-shrink-0">
        <span className="text-lg font-semibold text-navy-step-text">{step.number}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-muted-foreground">{step.formula}</p>
        <p className="text-sm text-white">{step.calculation}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <ChevronRight className="w-4 h-4 text-navy-step-text" />
        <div className="bg-navy-result px-4 py-2 rounded-md">
          <span className="text-lg font-semibold text-white">{formatNumber(step.result)}</span>
        </div>
      </div>
    </motion.div>
  );
}

function CalculationSteps({ steps }: { steps: Step[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-[0.1em] text-center mb-4">
        Étapes de calcul
      </p>
      <div className="flex flex-col gap-2">
        {steps.map((step, index) => (
          <StepCard key={step.number} step={step} index={index} />
        ))}
      </div>
    </motion.div>
  );
}

function FinalResult({ value }: { value: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-navy-card border-2 border-accent-orange rounded-xl p-6 text-center mt-4"
    >
      <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-[0.1em] mb-2">
        Résultat final
      </p>
      <p className="text-4xl font-bold text-accent-orange">
        {formatNumber(value)}
      </p>
    </motion.div>
  );
}

function FooterBadge() {
  return (
    <div className="fixed bottom-4 right-4 bg-navy-result border border-navy-card-border rounded-full px-4 py-1.5 flex items-center gap-1.5 z-50">
      <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">M</span>
      </div>
      <span className="text-xs text-muted-foreground">by Medo</span>
    </div>
  );
}

export default function App() {
  const [valeurA, setValeurA] = useState('');
  const [valeurB, setValeurB] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [shakeA, setShakeA] = useState(false);
  const [shakeB, setShakeB] = useState(false);

  const handleCalculate = useCallback(() => {
    const a = parseFloat(valeurA);
    const b = parseFloat(valeurB);

    let hasError = false;

    if (isNaN(a) || valeurA.trim() === '') {
      setShakeA(true);
      setTimeout(() => setShakeA(false), 300);
      hasError = true;
    }

    if (isNaN(b) || valeurB.trim() === '') {
      setShakeB(true);
      setTimeout(() => setShakeB(false), 300);
      hasError = true;
    }

    if (hasError) return;

    const calculatedSteps = calculateSteps(a, b);
    setSteps(calculatedSteps);
    setShowResults(true);
  }, [valeurA, valeurB]);

  const handleReset = useCallback(() => {
    setValeurA('');
    setValeurB('');
    setShowResults(false);
    setSteps([]);
  }, []);

  return (
    <div className="min-h-screen bg-navy-page text-white">
      <div className="max-w-[520px] mx-auto px-4 sm:px-6 pt-12 pb-24">
        <Header />
        <InputForm
          valeurA={valeurA}
          valeurB={valeurB}
          onValeurAChange={setValeurA}
          onValeurBChange={setValeurB}
          onCalculate={handleCalculate}
          onReset={handleReset}
          shakeA={shakeA}
          shakeB={shakeB}
        />
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {showResults && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CalculationSteps steps={steps} />
                <FinalResult value={steps[steps.length - 1]?.result ?? 0} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <FooterBadge />
    </div>
  );
}
