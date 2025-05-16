export default function BackButton(props: { setMenuState: React.Dispatch<React.SetStateAction<string>>, menuState: string }) {
    const { setMenuState, menuState } = props;
 
    return (
        <button
            className="
        bg-black
        w-[80px] h-[40px]
        [@media(min-width:1024px)]:w-[150px]
        [@media(min-width:1024px)]:h-[80px]
        flex justify-center items-center
        rounded-[20px]
        border-2 border-cyan-400
        shadow-[0_0_20px_#00ffff]
        hover:scale-105 hover:shadow-[0_0_40px_#00ffff]
        transition-transform duration-300
        m-[10px] [@media(min-width:1024px)]:m-[30px]
        absolute
      "
            onClick={() => setMenuState(menuState.slice(0, -1))}
        >
            <div className="text-[20px] [@media(min-width:1024px)]:hidden bg-gradient-to-b from-blue-800 via-blue-500 to-white bg-clip-text text-transparent">
                &lt;
            </div>
            <div className="hidden [@media(min-width:1024px)]:inline text-[30px] bg-gradient-to-b from-blue-800 via-blue-500 to-white bg-clip-text text-transparent">
                Back
            </div>
        </button>
    );
}
 
 