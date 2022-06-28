export type UseStepperProps = {
  steps: number;
  initialStep?: number;
  percentageDecimal?: number;
};

export type UseStepperReturn = {
  step: number;
  canGoForwards: boolean;
  canGoBackwards: boolean;
  percentComplete: number;
  next: () => void;
  previous: () => void;
  goTo: (newStep: number) => void;
};
