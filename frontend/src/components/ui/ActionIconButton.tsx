import Button, { ButtonProps } from '@ui/Button';
import Tooltip from '@ui/Tooltip';

type Props = ButtonProps & {
    title: string;
    request: () => Promise<any>;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ActionIconButton = ({ title, disabled, children, request, setLoading, color = 'primary', ...rest }: Props) => (
    <Tooltip content={<div className="text-xs">{title}</div>}>
        <Button
            {...rest}
            isIconButton
            color={color}
            disabled={disabled}
            onClick={() => {
                if (setLoading) {
                    setLoading(true);
                }

                request().finally(() => setLoading && setLoading(false));
            }}
        >
            {children}
        </Button>
    </Tooltip>
);

export default ActionIconButton;
