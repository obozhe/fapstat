import Button from '@ui/Button';

const ComingSoon = () => {
    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col gap-5">
            <h1>Coming Soon</h1>
            <Button color='primary' onClick={() => history.back()}>Back</Button>
        </div>
    );
};

export default ComingSoon;
