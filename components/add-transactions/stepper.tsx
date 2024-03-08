const STEPS = [
  {
    id: "Step 1",
    name: "Upload your CSV and select the columns",
  },
  {
    id: "Step 2",
    name: "Update the transactions",
  },
];

type StepperProps = {
  currentStep: number;
};

export const Stepper = ({ currentStep }: StepperProps) => {
  return (
    <div className="my-4">
      <ul className="flex gap-4">
        {STEPS.map((step, index) => (
          <li key={step.name} className="md:flex-1">
            {currentStep > index ? (
              <div className="flex flex-col w-full py-2 pl-4 transition-colors border-l-4 group border-primary md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium transition-colors text-primary ">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            ) : currentStep === index ? (
              <div
                className="flex flex-col w-full py-2 pl-4 border-l-4 border-primary md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-primary">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            ) : (
              <div className="flex flex-col w-full h-full py-2 pl-4 transition-colors border-l-4 border-gray-200 group md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-gray-500 transition-colors">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
