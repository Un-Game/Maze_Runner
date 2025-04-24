import BackButton from "../_components/back_button";

type props = {
  setMenuState: React.Dispatch<React.SetStateAction<string>>;
};

export default function Multiplayer(props: props) {
  const { setMenuState } = props;
  return (
    <div className="w-full h-[calc(100vh-100px)]">
      <BackButton setMenuState={setMenuState} />
      <div className="w-[100vw] flex flex-grow justify-center items-center">
        <div className="w-fit h-fit bg-pink-200/20">
        </div>
      </div>
    </div>
  );
}
