export interface TabLink {
    label: string;
    path: string;
}

export interface TableOptionsDto {
    page: number;
    pageSize: number;
    filters: {
        [key: string]: string | string[] | number | number[] | boolean;
    };
}

export interface TableData<T> {
    rows: T[];
    total: number;
}

export interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    onSubmit?: (...args: any[]) => void;
    submitLabel?: string;
    disabled?: boolean;
    disableActions?: boolean;
}

export type StepperSteps = StepperStep[];
export interface StepperStep {
    content: JSX.Element;
}
