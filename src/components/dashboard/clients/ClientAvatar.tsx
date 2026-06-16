import { CLIENT_AVATAR_GRADIENTS } from '@/constants/ui';

interface ClientAvatarProps {
  name: string;
  index: number;
}

export function ClientAvatar({ name, index }: ClientAvatarProps) {
  const initials = name.split(' ').map((n) => n[0]).join('');
  const gradient = CLIENT_AVATAR_GRADIENTS[index % CLIENT_AVATAR_GRADIENTS.length];
  return (
    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm`}>
      <span className="text-xs font-bold text-white">{initials}</span>
    </div>
  );
}
