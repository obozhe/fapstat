import { ReactComponent as SadChel } from '@images/chel-face-sad.svg';
import { ReactComponent as Chel } from '@images/chel-face.svg';
import Button from '@ui/Button';

type Props = {
    message: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    errorState?: boolean;
};

const InfoPage = ({ message, description, actionLabel, onAction, errorState }: Props) => (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
        <span className="mb-5">{errorState ? <SadChel /> : <Chel />}</span>

        <h1 className="text-2xl font-semibold uppercase">{message}</h1>
        {description && <h3 className="text-xl">{description}</h3>}
        {actionLabel && onAction && (
            <Button className="mt-6 w-[300px]" color="primary" onClick={onAction}>
                {actionLabel}
            </Button>
        )}
    </div>
);

export default InfoPage;
