import BackButton from "../_components/back_button";
import KB_button from "./_components_/key_bind_button_up";
import KB_button_d from "./_components_/key_bind_button_down";
import KB_button_l from "./_components_/key_bind_button_left";
import KB_button_r from "./_components_/key_bind_button_right";
import KBBS1 from "./_components_/KBBS1";
import KBBS2 from "./_components_/KBBS2";
import KBBS3 from "./_components_/KBBS3";
type props = {
  setMenuState: React.Dispatch<React.SetStateAction<string>>;
  menuState: string;
};
export default function Key_Bind(props: props) {
  const { setMenuState, menuState } = props;
  return (
    <div className="w-full h-[calc(100vh-100px)] overflow-scroll">
      <BackButton setMenuState={setMenuState} menuState={menuState} />
      <div className="flex flex-col items-center justify-center">
        <h3 className="uppercase text-4xl font-extrabold text-start">
          movement:
        </h3>
        {/* movement */}
        <KB_button />
        <KB_button_d />
        <KB_button_l />
        <KB_button_r />
        <h3 className="uppercase text-4xl font-extrabold text-start mt-[5px]">
          skills:
        </h3>
        {/* skills */}
        <KBBS1 />
        <KBBS2 />
        <KBBS3 />
      </div>
    </div>
  );
}