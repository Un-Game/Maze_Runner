import BackButton from "../_components/back_button"
import GameAreaPractice from "../game_container/game_area_practice";

type props = {
    setMenuState: React.Dispatch<React.SetStateAction<string>>;
}

export default function Solo(props: props) {
    const { setMenuState } = props;
    return (
        <div className="w-full h-[calc(100vh-100px)] flex flex-col">
            <BackButton setMenuState={setMenuState}/>
            <div className="w-[100vw] flex flex-grow justify-center items-center">
                <div className="w-fit h-fit bg-pink-200/20">
                    <GameAreaPractice />
                </div>
            </div>
        </div>
    )
}