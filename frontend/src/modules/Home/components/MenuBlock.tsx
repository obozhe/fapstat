import Button from '@ui/Button';
import { DialogNames } from 'core/enums/DialogNames';
import { useStateContext } from 'hooks/useStateContext';
import { Plus, User, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

type Props = { refetch: () => void };

const MenuBlock = ({ refetch }: Props) => {
    const { open } = useStateContext();

    return (
        <div className="flex flex-col gap-2 w-full sm:w-fit">
            <h3 className="uppercase text-xl">Menu</h3>
            <div className="grid grid-cols-3 gap-2">
                <Button
                    onClick={() => open(DialogNames.CreateEvent, { onSubmit: refetch })}
                    color="primary"
                    className="relative group aspect-square !w-full !h-full sm:!w-[114px] sm:!h-[114px] border-3 border-primary rounded uppercase flex items-center justify-center"
                >
                    <Plus className="group-hover:hidden w-8 h-8" />
                    <div className="group-hover:flex hidden absolute top-0 bottom-0 left-0 right-0 text-center items-center p-4">
                        Create record
                    </div>
                </Button>
                <NavLink to="/coming-soon">
                    <Button
                        color="primary"
                        className="relative group aspect-square !w-full !h-full sm:!w-[114px] sm:!h-[114px] border-3 border-primary rounded uppercase flex items-center justify-center"
                    >
                        <Users className="group-hover:hidden w-8 h-8" />
                        <div className="group-hover:flex hidden absolute top-0 bottom-0 left-0 right-0 text-center items-center p-4">
                            View friends activity
                        </div>
                    </Button>
                </NavLink>
                <NavLink to="/my">
                    <Button
                        color="primary"
                        className="relative group aspect-square !w-full !h-full sm:!w-[114px] sm:!h-[114px] border-3 border-primary rounded uppercase flex items-center justify-center"
                    >
                        <User className="group-hover:hidden w-8 h-8" />
                        <div className="group-hover:flex hidden absolute top-0 bottom-0 left-0 right-0 text-center items-center p-4">
                            Open profile
                        </div>
                    </Button>
                </NavLink>
            </div>
        </div>
    );
};

export default MenuBlock;
