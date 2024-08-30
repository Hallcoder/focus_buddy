import { SlOptionsVertical } from "react-icons/sl";
function ListingComponent({title,subTitle}:{title:string,subTitle:string}) {
  return (
    <div className="flex justify-between items-center border m-2 p-1 rounded-md">
      <span className="flex flex-col">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-primary">{subTitle}</p>
      </span>
      <span>
        <SlOptionsVertical />
      </span>
    </div>
  );
}

export default ListingComponent;
