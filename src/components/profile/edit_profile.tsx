import { AddAvatar } from "../_components/add_avatar";
import BackButton from "../_components/back_button";
import { ChangePassword } from "../_components/change_password";

type props = {
    setMenuState: React.Dispatch<React.SetStateAction<string>>;
    menuState: string;
};
export default function Edit_Profile(props: props) {
    const { setMenuState, menuState } = props;

    return (
        <div className="w-full h-[calc(100vh-100px)] overflow-scroll">
            <BackButton setMenuState={setMenuState} menuState={menuState} />
            <div className="flex flex-col items-center justify-center mt-10 gap-10">
                <AddAvatar />
                <ChangePassword />
            </div>
        </div>
    )
}