"use client";

// import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
//import { LiaSpinnerSolid } from "react-icons/lia";

export function ModalCondictions({ onClose }: { onClose: () => void }) {
  //const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative bg-white p-8 md:p-10 h-full md:h-auto rounded-md shadow-lg z-60 flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-black"
        >
          <IoCloseOutline className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center space-y-4 font-serif">
          <h1 className="text-blue-950 text-xl font-bold underline">
            Condições Gerais
          </h1>
          <div className="text-justify lg:w-[700px] md:w-96 ">
            <p className="text-blue-950">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia
              est dicta neque quisquam voluptates deserunt esse vel quasi
              molestias sunt, numquam perspiciatis pariatur repudiandae labore
              temporibus perferendis! Perspiciatis, commodi aperiam?
              <br />
              <br />
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Repudiandae minima velit ipsum exercitationem quos minus culpa
              maiores praesentium nam voluptatum. Id nobis, ullam possimus magni
              suscipit deleniti asperiores qui vero.
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
              pariatur laborum sed? Fuga accusamus obcaecati aliquam, ipsam
              impedit pariatur assumenda laudantium, officia debitis temporibus
              ut laborum tempore possimus perspiciatis necessitatibus.
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <input
              type="checkbox"
              className=" bg-blue-950 hover:bg-blue-950 "
            />
            <label className="text-blue-900 underline">Aceito</label>
          </div>
        </div>
      </div>
    </div>
  );
}
