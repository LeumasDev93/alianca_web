export const ErrorMessage = ({ error }: { error: string }) => (
  <div className="flex flex-col justify-center items-center my-40 w-auto bg-gray-200 p-5 rounded-xl shadow-lg">
    <p className="text-red-500 text-sm md:text-lg">{error}</p>
  </div>
);