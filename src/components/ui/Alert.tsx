import clsx from 'clsx';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'success';
  message: string;
}

export function Alert({ type = 'error', message }: AlertProps) {
  return (
    <div className={clsx(
      "p-4 rounded-md flex items-center gap-2",
      type === 'error' ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
    )}>
      {type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
      <span>{message}</span>
    </div>
  );
}
