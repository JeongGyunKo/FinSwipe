//이미지
import checkbox2Off from "../../assets/ic_checkbox2_off.svg";
import checkbox2On from "../../assets/ic_checkbox2_on.svg";

interface StockCardProps {
  ticker: string;
  name: string;
  corp: string;
  isSelected: boolean;
  onToggle: () => void;
}

export const StockCard = ({ ticker, name, corp, isSelected, onToggle} : StockCardProps) => {

  return (
    <div 
      onClick={onToggle}
      className={`flex justify-between items-center p-4 rounded-2xl border bg-white
        ${isSelected
          ? "border-blue-600"
          : "border-gray-200"
        }
      `}      
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-gray-900">{name}</p>
          <p className="h-5 px-2 leading-5 rounded bg-gray-100 text-xs text-gray-600">{ticker}</p>
        </div>
        <p className="text-sm text-gray-600">{corp}</p>
      </div>
      <div>
        {isSelected ? (
          <img src={checkbox2On} alt="" />
        ) : (
          <img src={checkbox2Off} alt="" />
        )}
      </div>
    </div>
  );
};