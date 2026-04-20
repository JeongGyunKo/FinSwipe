//이미지
import Tip from "../../assets/ic_tip.svg";

interface NoticeBoxProps {
  contents: string[];
}

export const NoticeBox = ({contents} : NoticeBoxProps) => {
  return (
    <div className="p-4 border rounded-xl border-amber-200 bg-amber-50">
      <div className="flex items-center gap-3 mb-2 text-sm font-semibold text-amber-900 ">
        <img src={Tip} alt="" />
        투자 유의사항
      </div>

      {/* 내용 영역 */}
      <ul className="flex flex-col gap-1">
        {contents.map((item, index) => (
          <li key={index} className="pl-8 text-xs text-amber-800">{item}</li>
        ))}
      </ul>
    </div>
  );
};