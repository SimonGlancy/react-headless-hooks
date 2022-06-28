import { useCallback, useMemo, useState } from 'react';
import { UseStepperProps, UseStepperReturn } from './useStepper.types';

const initialiseUseStepper = (steps: number, initialStep: number) => {
  if (initialStep <= steps && initialStep >= 1) {
    return initialStep;
  }
  return 1;
};

const useStepper = (props: UseStepperProps): UseStepperReturn => {
  const { steps, initialStep = 1, percentageDecimal = 0 } = props;
  const [step, setStep] = useState<number>(() => initialiseUseStepper(steps, initialStep));

  const canGoForwards = useMemo(() => step < steps, [step, steps]);
  const canGoBackwards = useMemo(() => step > 1, [step, steps]);
  const percentComplete = useMemo(
    () => Number(Math.floor(((step - 1) / steps) * 100).toFixed(percentageDecimal)),
    [step, steps, percentageDecimal]
  );

  const next = useCallback(() => {
    if (canGoForwards) {
      setStep((prev) => prev + 1);
    }
  }, [canGoForwards]);

  const previous = useCallback(() => {
    if (canGoBackwards) {
      setStep((prev) => prev - 1);
    }
  }, [canGoBackwards]);

  const goTo = useCallback(
    (newStep: number) => {
      if (newStep <= steps && newStep >= 1) {
        setStep(newStep);
      }
    },
    [steps]
  );

  return {
    step,
    canGoForwards,
    canGoBackwards,
    percentComplete,
    next,
    previous,
    goTo,
  };
};

export default useStepper;
