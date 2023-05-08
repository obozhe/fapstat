import { NavLink } from 'react-router-dom';

import { settingsRoutes } from '../consts/settingsRoutes';

const SettingsNavigation = () => {
    return (
        <section className="md:flex-[2] md:border-r-4 border-black h-fit max-w-[calc(100vw-32px)]">
            <ul className="transparent-scroll flex md:flex-col gap-5 overflow-x-auto whitespace-nowrap">
                {settingsRoutes.map(({ name, path }) => (
                    <NavLink to={path} key={path} className="sm:w-fit">
                        <li>
                            <h3 className="uppercase">{name}</h3>
                        </li>
                    </NavLink>
                ))}
            </ul>
        </section>
    );
};

export default SettingsNavigation;
