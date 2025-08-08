'use client';

interface WhatsAppShareProps {
  title?: string;
  description?: string;
  url?: string;
  className?: string;
  buttonText?: string;
  variant?: 'default' | 'floating' | 'minimal';
}

export default function WhatsAppShare({ 
  title = "TeamsQA - Academia de Automatización", 
  description = "Conoce más sobre TeamsQA y nuestra misión de enseñar automatización de pruebas",
  url,
  className = "",
  buttonText = "Compartir en WhatsApp",
  variant = 'default'
}: WhatsAppShareProps) {
  
  // Get current URL if not provided
  const currentUrl = typeof window !== 'undefined' ? window.location.href : url || '';
  
  const shareText = `${title}\n\n${description}\n\n${currentUrl}`;
  const encodedText = encodeURIComponent(shareText);
  
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;

  const handleShare = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Variant styles
  const variants = {
    default: "flex items-center gap-2 bg-[#25D366] hover:bg-[#20b55a] text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg",
    floating: "fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-[#25D366] hover:bg-[#20b55a] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center hover:scale-110",
    minimal: "text-[#25D366] hover:text-[#20b55a] transition-colors duration-200 underline"
  };

  const whatsappIcon = (
    <svg className={`${variant === 'floating' ? 'w-7 h-7' : 'w-5 h-5'}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.594z"/>
    </svg>
  );

  return (
    <button
      onClick={handleShare}
      className={`${variants[variant]} ${className} ${variant === 'floating' ? 'animate-pulse hover:animate-none' : ''}`}
      title={variant === 'floating' ? buttonText : undefined}
    >
      {whatsappIcon}
      {variant !== 'floating' && (
        <span className={variant === 'minimal' ? '' : 'font-medium'}>
          {buttonText}
        </span>
      )}
    </button>
  );
}
