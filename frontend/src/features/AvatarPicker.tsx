import Button from '@ui/Button';
import EmojiPicker, { Categories, Emoji } from 'emoji-picker-react';
import { ArrowRight, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { TwitterPicker } from 'react-color';

import Avatar from '../components/Avatar';
import Dialog from '../components/Dialog';

const categories = [
    { category: Categories.SMILEYS_PEOPLE, name: 'Smileys & People' },
    { category: Categories.ANIMALS_NATURE, name: 'Animals & Nature' },
    { category: Categories.FOOD_DRINK, name: 'Food & Drink' },
    { category: Categories.TRAVEL_PLACES, name: 'Travel' },
    { category: Categories.ACTIVITIES, name: 'Activities' },
    { category: Categories.OBJECTS, name: 'Objects' },
    { category: Categories.SYMBOLS, name: 'Symbols' },
    { category: Categories.FLAGS, name: 'Flags' },
];

type Props = {
    avatar: {
        emoji: string;
        color: string;
    };
    onSave: (avatar: { emoji: string; color: string }) => void;
};
const AvatarPicker = (props: Props) => {
    const [open, setOpen] = useState(false);
    const [avatar, setAvatar] = useState(props.avatar);
    const [emoji, setEmoji] = useState(props.avatar.emoji);
    const [color, setColor] = useState(props.avatar.color);

    const onSave = () => {
        props.onSave({ emoji, color });
        setAvatar({ emoji, color });
        setOpen(false);
    };

    const onClose = () => {
        setOpen(false);
        setEmoji(avatar.emoji);
        setColor(avatar.color);
    };

    return (
        <div>
            <Button
                isIconButton
                color="transparent"
                className="group relative !p-0 !border-none"
                circle
                onClick={() => setOpen(true)}
                size="xxl"
            >
                <div className="w-full h-full">
                    <Avatar color={avatar.color} emoji={avatar.emoji} />
                </div>
                <div className="group-hover:flex hidden items-center justify-center absolute top-0 rounded-full bg-primary h-[48px] w-[48px] bg-opacity-60">
                    <Pencil className="h-6 w-6 text-white" />
                </div>
            </Button>

            <Dialog isOpen={open} submitLabel="save" onSubmit={onSave} onClose={onClose}>
                <EmojiPicker
                    height={400}
                    width={280}
                    categories={categories}
                    previewConfig={{ showPreview: false }}
                    onEmojiClick={({ unified }) => setEmoji(unified)}
                />
                <TwitterPicker className="mx-auto" color={color} onChange={({ hex }) => setColor(hex)} />
                <div className="flex items-center justify-between mb-5">
                    <div
                        style={{ backgroundColor: color }}
                        className="rounded-full h-12 w-12"
                        onClick={() => setOpen(true)}
                    />
                    <Plus className="h-9 w-9" />
                    <Emoji unified={emoji} size={32} />
                    <ArrowRight className="h-9 w-9" />
                    <Avatar color={color} emoji={emoji} />
                </div>
            </Dialog>
        </div>
    );
};

export default AvatarPicker;
