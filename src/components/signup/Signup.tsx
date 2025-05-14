import axios from "axios";
import { useState } from "react";

type props = {
    setMenuState: React.Dispatch<React.SetStateAction<string>>;
};

const Signup = (props: props) => {
    const { setMenuState } = props;

    const [inputValue, setInputValue] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue({
            ...inputValue,
            [e.target.name]: e.target.value,
        });
        setErrors({
            ...errors,
            [e.target.name]: "",
        });
    };

    const handleSubmit = async () => {
        const { username, email, password } = inputValue;
        if (email === "" || password === "" || username === "") {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "https://maze-runner-backend-1.onrender.com/user",
                {
                    username,
                    email,
                    password,
                }
            );
            setMenuState("login");
        } catch (error: any) {
            if (error.response) {
                const errorMessages = error.response.data.errors;

                // Directly setting errors for specific fields
                if (errorMessages.username) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        username: errorMessages.username,
                    }));
                }

                if (errorMessages.email) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: errorMessages.email,
                    }));
                }

                if (errorMessages.password) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        password: errorMessages.password,
                    }));
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-[1000px] h-fit bg-white/10 p-[40px] flex flex-col gap-[40px] rounded-[20px] shadow-[0_0_20px_#00ffff] backdrop-blur-[10px]">
                <div className="text-[70px] font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_0_20px_rgba(255,0,255,0.6)] text-center">
                    Sign up here
                </div>
                <div className="flex flex-col gap-[30px]">
                    <input
                        type="text"
                        className="w-full h-[55px] text-[20px] outline-none border border-cyan-400 rounded-[10px] px-[15px]"
                        placeholder="Username"
                        name="username"
                        value={inputValue.username}
                        onChange={handleChange}
                        onKeyDown={handleEnter}
                    />
                    {errors.username && (
                        <div className="text-red-500 text-[20px]">{errors.username}</div>
                    )}

                    <input
                        type="text"
                        className="w-full h-[55px] text-[20px] outline-none border border-cyan-400 rounded-[10px] px-[15px]"
                        placeholder="Email"
                        name="email"
                        value={inputValue.email}
                        onChange={handleChange}
                        onKeyDown={handleEnter}
                    />
                    {errors.email && (
                        <div className="text-red-500 text-[20px]">{errors.email}</div>
                    )}

                    <input
                        type="password"
                        className="w-full h-[55px] text-[20px] outline-none border border-cyan-400 rounded-[10px] px-[15px]"
                        placeholder="Password"
                        name="password"
                        value={inputValue.password}
                        onChange={handleChange}
                        onKeyDown={handleEnter}
                    />
                    {errors.password && (
                        <div className="text-red-500 text-[20px]">{errors.password}</div>
                    )}

                    <button
                        className="w-full bg-black text-cyan-300 h-[60px] rounded-[10px] text-[25px] mt-[30px] flex justify-center items-center"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="rounded-full w-[30px] h-[30px] border-r-[3px] animate-spin"></div>
                        ) : (
                            "Sign up"
                        )}
                    </button>
                    <div className="flex gap-[20px]">
                        Already have an account?{" "}
                        <button
                            className="text-cyan-400"
                            onClick={() => setMenuState("login")}
                        >
                            Login here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
