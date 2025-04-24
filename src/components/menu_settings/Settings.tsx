import BackButton from "../_components/back_button"
import MapMaker from "../map_maker/mapMaker";

type props = {
    setMenuState: React.Dispatch<React.SetStateAction<string>>;
}

export default function Settings(props: props) {
    const { setMenuState } = props;
    return (
        <div className="w-full h-[calc(100vh-100px)] overflow-hidden">
            <BackButton setMenuState={setMenuState}/>
            <MapMaker />
        </div>
    )
}