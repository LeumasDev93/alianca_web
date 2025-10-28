import { LiaSpinnerSolid } from "react-icons/lia";
export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center my-40 w-48 bg-gray-200 p-5 rounded-xl shadow-lg">
      <LiaSpinnerSolid className="animate-spin h-5 w-5 md:w-10 md:h-10 text-[#B7021C]" />
      <span className="text-blue-950">Aguarde!</span>
    </div>
  );
};
