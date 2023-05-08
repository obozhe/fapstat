import { ReactComponent as Chel } from '@images/chel-thinking.svg';

const Loader = () => (
    <div className="absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-center items-center gap-4">
        <Chel className="animate-bounce w-[100px] h-[100px]" />
    </div>
);

export default Loader;
