import BackButton from "../_components/back_button";

type props = {
  setMenuState: React.Dispatch<React.SetStateAction<string>>;
  menuState: string;
};

export default function Solo(props: props) {
  const { setMenuState, menuState } = props;
  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col">
      <BackButton setMenuState={setMenuState} menuState={menuState} />
      <div className="w-[100vw] flex flex-grow justify-center items-center">
        <div className="flex flex-col gap-[30px]">
          <button
            className="w-[800px] py-5 text-4xl font-extrabold tracking-widest text-cyan-300 uppercase bg-black border-2 border-cyan-400 shadow-[0_0_20px_#00ffff] hover:scale-105 hover:shadow-[0_0_40px_#00ffff] transition-transform duration-300 text-start px-[30px] flex gap-[20px]"
            onClick={() => setMenuState(menuState + "1")}
          >
            Practice
          </button>
          <button
            className="w-[800px] py-5 text-4xl font-extrabold tracking-widest text-cyan-300 uppercase bg-black border-2 border-cyan-400 shadow-[0_0_20px_#00ffff] hover:scale-105 hover:shadow-[0_0_40px_#00ffff] transition-transform duration-300 text-start px-[30px] flex gap-[20px]"
            onClick={() => setMenuState(menuState + "2")}
          >
            Generated
          </button>
        </div>
      </div>
    </div>
  );
}
