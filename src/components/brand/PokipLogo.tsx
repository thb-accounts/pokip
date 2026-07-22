import pokipLogo from '@/assets/pokip-logo.png';
import pokipIcon from '@/assets/pokip-icon.png';

interface PokipLogoProps {
  variant?: 'full' | 'mark';
  className?: string;
}

export const PokipLogo = ({ variant = 'full', className = 'h-8 w-auto' }: PokipLogoProps) => {
  const src = variant === 'full' ? pokipLogo : pokipIcon;
  return (
    <img
      src={src}
      alt="POKIP"
      className={className}
      width={variant === 'full' ? 1248 : 512}
      height={variant === 'full' ? 544 : 512}
    />
  );
};