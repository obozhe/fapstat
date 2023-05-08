import { Emoji } from 'emoji-picker-react';

type Props = {
    emoji: string;
    color: string;
};

const Avatar = ({ emoji, color }: Props) => (
    <div style={{ backgroundColor: color }} className="rounded-full p-2 w-fit">
        <Emoji unified={emoji} size={32} />
    </div>
);
export default Avatar;
