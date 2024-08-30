import { useState } from "react";
import FloatingActionButton from "./floatingActionButton";
import { useNavigate } from "react-router-dom";

const Tabs = ({ children }: { children: any }) => {
  const navigate  = useNavigate();

  const [activeTab, setActiveTab] = useState<number>(0);
  const [addUrl,setAddUrl] = useState<string>();
  const handleTabClick = (index: any,child:any) => {
    setActiveTab(index);
    console.log(`add-${child.props.label.toLowerCase().split(" ").join("-")}`)
    setAddUrl(`add-${child.props.label.toLowerCase().split(" ").join("-")}`);
  };

  const handleClickButton = () => {
     navigate(`/${addUrl}`);
  };
  return (
    <div className="">
      <div className="flex justify-center bg-gray-100 w-11/12 m-auto rounded-md">
        {children.map((child: any, index: any) => (
          <button
            key={index}
            onClick={() => handleTabClick(index,child)}
            className={
              activeTab === index
                ? "font-semibold w-full bg-white m-1 text-xs rounded-md px-20 py-2"
                : "font-semibold w-full text-xs px-20 py-2"
            }
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{children[activeTab]}</div>
      <div className="flex items-end justify-end m-2">
        <FloatingActionButton onClick={handleClickButton} />
      </div>
    </div>
  );
};

export default Tabs;
