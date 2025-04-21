import BackButton from "../_components/back_button"

type props = {
    setMenuState: React.Dispatch<React.SetStateAction<string>>;
}

export default function Multiplayer(props: props) {
    const { setMenuState } = props;
    return (
        <div className="w-full h-[calc(100vh-100px)]">
            <BackButton setMenuState={setMenuState}/>
        </div>
    )
}