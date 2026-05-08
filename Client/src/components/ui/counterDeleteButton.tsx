import { useEffect, useState } from 'react';
import { Button } from './button';

type Props = {
  onConfirm: () => void;
  seconds?: number;
  label?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
};
export function CounterDeleteButton({
  onConfirm,
  seconds: initial = 3,
  label = 'Delete',
  variant = 'default',
  size = 'default',
}: Props) {
  const [seconds, setSeconds] = useState(initial);

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const enabled = seconds === 0;

  return (
    <Button
      variant={variant}
      size={size}
      disabled={!enabled}
      onClick={onConfirm}
    >
      {enabled ? label : `${label} (${seconds})`}
    </Button>
  );
}
