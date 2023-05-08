import { Transition } from '@headlessui/react';
import Button from '@ui/Button';
import { StepperSteps } from 'core/types/ui';
import { useEffect, useState } from 'react';

type Props = {
    steps: StepperSteps;
    step?: number;
    showActions?: boolean;
};

const Stepper = ({ steps, step, showActions = false }: Props) => {
    const [currentStep, setCurrentStep] = useState(step || 0);
    const [isReadyForTransition, setIsReadyForTransition] = useState(true);

    useEffect(() => {
        if (step !== undefined && Number.isInteger(step)) {
            setCurrentStep(step);
        }
    }, [step, setCurrentStep]);

    const handleNext = () => setCurrentStep((i) => i + 1);
    const handlePrevious = () => setCurrentStep((i) => i - 1);

    return (
        <div className="w-full h-full overflow-hidden">
            <div className="h-full w-full grid grid-rows-[1fr_auto]">
                {steps.map(({ content }, i) => (
                    <Transition
                        afterEnter={() => setIsReadyForTransition(true)}
                        beforeLeave={() => setIsReadyForTransition(false)}
                        afterLeave={() => setIsReadyForTransition(true)}
                        appear={true}
                        key={i}
                        className="h-full w-full"
                        show={currentStep === i && isReadyForTransition}
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        {content}
                    </Transition>
                ))}

                {showActions && (
                    <div className="h-10 flex justify-between">
                        <div>
                            {currentStep !== 0 && (
                                <Button disabled={currentStep === 0} onClick={handlePrevious}>
                                    Back
                                </Button>
                            )}
                        </div>

                        <div>
                            {currentStep !== steps.length - 1 && (
                                <Button disabled={currentStep === steps.length - 1} onClick={handleNext}>
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stepper;
