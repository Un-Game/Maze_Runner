import BackButton from "../_components/back_button";

type props = {
  setMenuState: React.Dispatch<React.SetStateAction<string>>;
  menuState: string;
};

export default function Settings(props: props) {
  const { setMenuState, menuState } = props;
  return (
    <div className="w-full h-[calc(100vh-100px)] overflow-hidden">
      <BackButton setMenuState={setMenuState} menuState={menuState} />
      <div className="flex flex-col items-center mt-[100px]">
        <button
          className="w-[800px] py-5 text-4xl font-extrabold tracking-widest text-cyan-300 uppercase bg-black border-2 border-cyan-400 shadow-[0_0_20px_#00ffff] hover:scale-105 hover:shadow-[0_0_40px_#00ffff] transition-transform duration-300 text-start px-[30px] flex gap-[20px]"
          onClick={() => setMenuState(menuState + "1")}
        >
          Map Maker
        </button>
        <div
          className="w-[800px] py-5 mt-[20px] text-4xl font-extrabold tracking-widest text-cyan-300 uppercase bg-black border-2 border-cyan-400 shadow-[0_0_20px_#00ffff] hover:scale-105 hover:shadow-[0_0_40px_#00ffff] transition-transform duration-300 text-start px-[30px] flex gap-[20px]"
          onClick={() => setMenuState(menuState + "2")}
        >
          Key Bind
        </div>
      </div>
    </div>
  );
}
