import { useEffect, useState } from "react";

export default function Loader() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHide(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center transition-all duration-700 z-[9999] ${
        hide ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-15 h-15 border-4 border-black border-t-blue-500 border-b-white rounded-full animate-spin"></div>
        <h1 className="text-3xl animate-pulse flex items-center font-black tracking-tighter">
          <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
          Nav
         </span>
         <span className="text-gray-900 dark:text-white">
          Kalpana
         </span>
       </h1>
      </div>
    </div>
  );
}
