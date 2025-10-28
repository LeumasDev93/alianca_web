import { FaChevronDown } from "react-icons/fa";


export const TypeSecurity = () => {
   return (
    <div className="flex w-full  border border-b-[#b9b8b8] border-l-[#b9b8b8] border-r-[#b9b8b8] mb-3 rounded-b-xl shadow-xl ">
        <div className="flex flex-col items-center p-2 md:px-6 md:py-4 bg-[#e6e3e3] rounded-l-xl flex-1 md:pb-6 ">
            <div className="w-full flex justify-center">
              <div className="flex justify-between items-center max-w-[200px] w-full">
                <span className="text-[#6f7070] font-medium md:font-bold text-sm md:text-xl">SORCA</span>
                <FaChevronDown className="text-[#6f7070]"/>
              </div>
            </div>
            
            <div className="w-full flex justify-center mt-1">
              <div className="max-w-[200px] w-full text-left">
                <span className="text-sm text-[#6f7070] md:font-semibold">Seguro Obrigatório</span>
              </div>
            </div>
        </div>
        
        <div className="flex flex-col items-center p-2 md:px-6 md:py-4 flex-1">
            <div className="w-full flex justify-center">
                <div className="flex justify-between items-center max-w-[200px] w-full">
                </div>
            </div>
            <div className="w-full flex justify-center mt-1">
                <div className="max-w-[200px] w-full text-left">
                </div>
            </div>
        </div>
        
        <div className="flex flex-col items-center p-2 md:px-6 md:py-4 flex-1 md:mb-6">
            <div className="w-full flex justify-center">
                <div className="flex justify-between items-center w-full">
                  
                </div>
            </div>
            <div className="w-full flex justify-center mt-1">
                <div className=" w-full text-left">
                   
                </div>
            </div>
        </div>
    </div>
   );
}