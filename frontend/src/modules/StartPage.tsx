import { ReactComponent as Chel } from '@images/chel-with-body.svg';
import Button from '@ui/Button';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthPaths } from 'routes/paths';

const StartPage = () => {
    return (
        <main className="max-w-[1600px] h-full mx-auto flex flex-col gap-12 font-montserrat p-4">
            <header className="md:pt-[70px] flex justify-between items-center">
                <span className="font-bold">FAPSTAT.ME</span>
                <Link to={'/auth/' + AuthPaths.SignIn}>
                    <Button isIconButton size="xxl">
                        <LogIn />
                    </Button>
                </Link>
            </header>

            <div className="flex-1 flex items-center font-semibold">
                <div className="flex flex-col justify-center gap-[40px] flex-1 text-xl">
                    <h1 className="text-6xl uppercase">Track your feelings</h1>
                    <p>
                        Faps is a natural and common form of sexual expression that is often viewed with shame and
                        stigma. Many individuals feel embarrassed or guilty about faps, whether due to societal norms,
                        religious beliefs, or personal feelings of shame. However, it is important to recognize that
                        faps is a normal and healthy activity that can provide numerous physical and mental health
                        benefits.
                    </p>

                    <p>
                        Tracking faps can have positive benefits such as increasing self-awareness, identifying
                        potential issues with sexual health, promoting accountability and self-care, and exploring new
                        forms of pleasure. It can help individuals develop a healthy and positive relationship with
                        their own bodies and sexual desires.
                    </p>
                </div>
                <span className="lg:inline-block hidden">
                    <Chel />
                </span>
            </div>
        </main>
    );
};

export default StartPage;
