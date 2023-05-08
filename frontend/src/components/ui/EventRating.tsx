import { ReactComponent as RatingHappyChel } from '@images/rating-happy-chel.svg';
import { ReactComponent as RatingNormalChel } from '@images/rating-normal-chel.svg';
import { ReactComponent as RatingSadChel } from '@images/rating-sad-chel.svg';
import { ReactComponent as RatingSemiHappyChel } from '@images/rating-semihappy-chel.svg';
import { ReactComponent as RatingSemiSadChel } from '@images/rating-semisad-chel.svg';

type Props = {
    value: number;
    onChange: (value: number) => void;
    label: string;
};

const emojis = [RatingSadChel, RatingSemiSadChel, RatingNormalChel, RatingSemiHappyChel, RatingHappyChel];

const EventRating = ({ value, onChange, label }: Props) => {
    return (
        <>
            <span className="font-semibold uppercase mb-0.5">{label}</span>
            <div className={`flex gap-5 [&>*:nth-child(${1})]:text-red-200`}>
                {emojis.map((Emoji, index) => (
                    <Emoji
                        key={String(index)}
                        className={`${index === value - 1 ? '[&>*]:fill-black' : '[&>*]:fill-gray-200'} cursor-pointer`}
                        onClick={() => onChange(index + 1)}
                    />
                ))}
            </div>
        </>
    );
};

export default EventRating;
