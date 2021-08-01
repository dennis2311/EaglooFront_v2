import React, {
    createContext,
    useContext,
    useState,
    useRef,
    RefObject,
} from "react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../../Routes/App/AppProvider";
import axios from "axios";
import { SHA3 } from "sha3";
import { ChildrenProp, API_ENDPOINT } from "../../Constants";
import { toastErrorMessage, toastLoginSuccessMessage } from "../../Utils";

interface LoginContext {
    emailInput: string;
    passwordInput: string;
    signingIn: boolean;
    setEmailInput: (input: string) => void;
    setPasswordInput: (input: string) => void;
    signIn: () => void;
    emailInputRef?: RefObject<HTMLInputElement>;
}

const InitialLoginContext: LoginContext = {
    emailInput: "",
    passwordInput: "",
    signingIn: false,
    setEmailInput: () => {},
    setPasswordInput: () => {},
    signIn: () => {},
};

const LoginContext = createContext<LoginContext>(InitialLoginContext);
export const useLoginContext = () => useContext(LoginContext);

export default function LoginProvider({ children }: ChildrenProp) {
    const history = useHistory();
    const { setIsLoggedIn, setUserEmail, setUserId } = useAppContext();
    const hashedPassword = new SHA3(512);
    const [emailInput, setEmailInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");
    const [signingIn, setSigningIn] = useState<boolean>(false);
    const emailInputRef = useRef<HTMLInputElement>(null);

    async function signIn() {
        setSigningIn(true);
        hashedPassword.reset();
        hashedPassword.update(passwordInput);
        await axios
            .get(
                `${API_ENDPOINT}/api/user/${emailInput}/${hashedPassword.digest(
                    "hex"
                )}`
            )
            .then(function ({ data }) {
                if (data.success) {
                    setIsLoggedIn(true);
                    setUserEmail(emailInput);
                    setUserId(data.user?.id);
                    toastLoginSuccessMessage(emailInput);
                    history.push("/");
                } else {
                    setSigningIn(false);
                    toastErrorMessage(data.errorMessage);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const loginContext = {
        emailInput,
        passwordInput,
        signingIn,
        setEmailInput,
        setPasswordInput,
        signIn,
        emailInputRef,
    };

    return (
        <LoginContext.Provider value={loginContext}>
            {children}
        </LoginContext.Provider>
    );
}