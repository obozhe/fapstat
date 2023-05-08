import { AchievementDto } from 'core/types/AchievementDto';
import { ReactNode, createContext, useState } from 'react';

import { DialogNames } from '../core/enums/DialogNames';

type State = {
    dialog: {
        isOpen: boolean;
        name: DialogNames | null;
        props: Record<string, unknown> | null;
    };
    achievements: AchievementDto[] | null;
};

type TStateContext = {
    isOpen: boolean;
    open: (name: DialogNames, dialogProps?: Record<string, unknown>) => void;
    close: () => void;
    name: DialogNames | null;
    props: Record<string, unknown> | null;
    achievements: AchievementDto[] | null;
    updateAchievementUnlock: (achievements: AchievementDto[] | null) => void;
} | null;

export const stateContext = createContext<TStateContext | null>(null);

const StateContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<State>({
        dialog: {
            isOpen: false,
            name: null,
            props: {},
        },
        achievements: null,
    });

    const open = (dialogName: DialogNames, dialogProps?: Record<string, unknown>) => {
        setState((prev) => ({ ...prev, dialog: { isOpen: true, props: dialogProps ?? {}, name: dialogName } }));
    };

    const close = () => {
        setState((prev) => ({ ...prev, dialog: { ...prev.dialog, isOpen: false } }));
        setTimeout(() => {
            setState((prev) => ({ ...prev, dialog: { ...prev.dialog, name: null, props: {} } }));
        }, 200);
    };

    const updateAchievementUnlock = (achievements: AchievementDto[] | null) => {
        setState((prev) => ({ ...prev, achievements }));
    };

    return (
        <stateContext.Provider
            value={{
                isOpen: state.dialog.isOpen,
                props: state.dialog.props,
                name: state.dialog.name,
                achievements: state.achievements,
                open,
                close,
                updateAchievementUnlock,
            }}
        >
            {children}
        </stateContext.Provider>
    );
};

export default StateContextProvider;
