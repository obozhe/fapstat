import SignInForm from 'modules/Auth/components/forms/SignInForm';
import { Link } from 'react-router-dom';
import { AuthPaths } from 'routes/paths';

const SignInPage = () => {
    return (
        <div className="flex justify-center px-3 items-center w-full h-full">
            <div className="flex flex-col m-auto max-w-sm w-full gap-2">
                <SignInForm />
                <div className="flex justify-between items-center">
                    <Link
                        to={'../' + AuthPaths.SignUp}
                        className="text-opacity-80 text-xs font-medium border-b-2 border-transparent hover:border-primary"
                    >
                        REGISTRATION
                    </Link>

                    <Link
                        to={'../' + AuthPaths.PasswordRestore}
                        className="text-opacity-80 text-xs font-medium border-b-2 border-transparent hover:border-primary"
                    >
                        RESTORE PASSWORD
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
