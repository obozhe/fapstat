import { useRouteError } from 'react-router-dom';

const ErrorBoundary = () => {
    const error = useRouteError();

    console.error(error);

    return <div>Error =(</div>;
};

export default ErrorBoundary;
