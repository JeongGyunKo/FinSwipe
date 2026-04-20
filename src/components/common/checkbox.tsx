// 이미지
import checkboxOff from "../../assets/ic_checkbox_off.svg";
import checkboxOn from "../../assets/ic_checkbox_on.svg";

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  size: "sm" | "md";
  isBold?: boolean;
}

export const Checkbox = ({
  id,
  checked,
  onChange,
  label,
  size = "sm",
  isBold = false
}: CheckboxProps) => {

  const sizeClass = size === "md"? "w-6 h-6" : "w-5 h-5"

  return (
    <div className="flex items-center gap-3 cursor-pointer group">
      <input type="checkbox" 
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="hidden"
      />

      <label htmlFor={id} className={`cursor-pointer shrink-0 ${sizeClass}`}>
        <img 
          src={checked ? checkboxOn : checkboxOff} 
          alt="checkbox icon"
          className="w-full h-full object-contain" />
      </label>

      {label && (
        <label
          htmlFor={id}
          className={`cursor-pointer select-none leading-none
            ${isBold ? "font-semibold text-base text-gray-900" : "font-medium text-sm gray-700"}
          `}
        >
          {label}
        </label>
      )}
      
    </div>
  );
};