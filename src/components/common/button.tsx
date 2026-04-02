interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline"; // 버튼 스타일 종류 | "ghost"
  size?: "md" | "lg";
  fullWidth?: boolean; // 가로 꽉 채움 여부
}

export const Button = ({
  children,
  variant = "primary",
  size = "lg",
  fullWidth = true,
  className,
  ...props
}: ButtonProps) => {
  
  // 1. 기본스타일
  const baseStyle = "flex items-center justify-center text-basic font-semibold rounded-xl cursor-pointer disabled:cursor-not-allowed"

  // 2. 종류(Variant)별 클래스
  const variants = {
    primary: "bg-blue-600 text-white disabled:bg-gray-200 disabled:text-gray-400",
    outline: "text-blue-600 border border-blue-600 disabled:opacity-50",
  };

  // 3. 버튼 크기별 클래스
  const sizes = {
    md: "h-13",
    lg: "h-14",
  };

  return (
    <button 
      className={`
        ${baseStyle}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full":"w-auto"}        
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};