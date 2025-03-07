import Image from 'next/image';
import { SVGProps } from 'react';

interface TeamsQALogoProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export default function TeamsQALogo({ className = '', ...props }: TeamsQALogoProps) {
  return (
    <div className="rounded-full overflow-hidden bg-white shadow-md">
      <Image 
        src="/Logo.svg"
        alt="TeamsQA Logo"
        width={48}
        height={48}
        className={`w-12 h-12 ${className}`}
        priority
      />
    </div>
  );
}