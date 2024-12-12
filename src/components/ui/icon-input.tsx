import React from 'react';

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-500">{icon}</span>
        <input
          {...props}
          ref={ref}
          className={`pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        />
      </div>
    );
  }
);

IconInput.displayName = 'IconInput';

export default IconInput;
