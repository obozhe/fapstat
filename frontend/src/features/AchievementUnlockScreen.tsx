import { Dialog, Transition } from '@headlessui/react';
import Button from '@ui/Button';
import Stepper from '@ui/Stepper';
import 'assets/styles/components/fireworks.scss';
import AchievementsApi, { AchievementsUrl } from 'core/services/AchievementApi';
import useFetchLazy from 'hooks/useFetchLazy';
import { useStateContext } from 'hooks/useStateContext';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const Fireworks = () => {
    return (
        <div className="pyro z-50">
            <div className="before"></div>
            <div className="after"></div>
        </div>
    );
};

const AchievementUnlockScreen = () => {
    const { achievements, updateAchievementUnlock } = useStateContext();
    const [open, setOpen] = useState(false);
    const [stepperStep, setStepperStep] = useState(0);

    useEffect(() => {
        setOpen(!!achievements);
    }, [achievements]);

    const { trigger: clearNewAchievements } = useFetchLazy(
        AchievementsUrl.clearAchievements,
        AchievementsApi.clearAchievements
    );

    const onClose = () => {
        clearNewAchievements();
        setStepperStep(0);
        setOpen(false);
        setTimeout(() => updateAchievementUnlock(null), 200);
    };

    const steps = useMemo(
        () =>
            achievements
                ? achievements.map((achievement) => {
                      return {
                          content: (
                              <div className="sm:w-96 bg-bg-main rounded p-4 text-primary">
                                  <div className="text-3xl">{achievement.label}</div>
                                  <div className="text-opacity-80">{achievement.description}</div>
                              </div>
                          ),
                      };
                  })
                : [],
        [achievements]
    );

    if (!achievements) {
        return null;
    }

    return (
        <Transition appear show={open}>
            <Dialog className="relative z-10" onClose={onClose}>
                <Transition.Child
                    className="flex min-h-full items-center justify-center md:p-4 text-center fixed inset-0 backdrop-blur-md bg-[rgba(0,0,0,0.5)] bg-opacity-25 text-bg-main"
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Fireworks />
                    <Dialog.Panel className="w-fit flex items-center gap-2 transform overflow-hidden p-10 text-left align-middle transition-all flex-wrap justify-between">
                        <div className="w-9 h-9 order-2 sm:order-1">
                            {stepperStep !== 0 && steps.length > 1 && (
                                <Button
                                    isIconButton
                                    className="hover:!bg-transparent text-white"
                                    onClick={() => setStepperStep((step) => step - 1)}
                                >
                                    <ChevronLeft />
                                </Button>
                            )}
                        </div>
                        <div className="relative p-6 pt-10 flex flex-col gap-5 border-3 border-bg-main rounded-lg text-center sm:order-2">
                            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-20 bg-bg-main rounded-full p-4">
                                <Trophy className="text-primary" size={40} />
                            </div>
                            <h1 className="sm:text-xl text-lg uppercase self-center">
                                Achievement{achievements.length > 1 ? 's' : ''} Unlocked!
                            </h1>
                            <Stepper step={stepperStep} steps={steps} />
                            {steps.length > 1 && (
                                <div className="self-end">
                                    {stepperStep + 1}/{steps.length}
                                </div>
                            )}
                        </div>
                        <div className="w-9 h-9 order-3">
                            {stepperStep !== steps.length - 1 && steps.length > 1 && (
                                <Button
                                    isIconButton
                                    className="hover:!bg-transparent text-white"
                                    onClick={() => setStepperStep((step) => step + 1)}
                                >
                                    <ChevronRight />
                                </Button>
                            )}
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
            <Fireworks />
        </Transition>
    );
};

export default AchievementUnlockScreen;
