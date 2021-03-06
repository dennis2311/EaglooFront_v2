import React, {
    createContext,
    useContext,
    RefObject,
    useRef,
    useState,
    useEffect,
} from "react";
import axios from "axios";
import { useAppContext } from "../../../../Routes/App/AppProvider";
import { useRoomContext } from "../../RoomProvider";
import {
    ChildrenProp,
    SocketChannel,
    ChattingContent,
    API_ENDPOINT,
} from "../../../../Constants";
import { toastErrorMessage } from "../../../../Utils";

interface RoomChattingContextProp {
    chattingInput: string;
    chattings: ChattingContent[];
    chatSending: boolean;
    setChattingInput: (content: string) => void;
    setChattings: (chatting: ChattingContent[]) => void;
    sendChatting: () => void;
    updateChatting: (newChatting: ChattingContent) => void;
    scrollerRef?: RefObject<HTMLDivElement>;
    chattingInputRef?: RefObject<HTMLInputElement>;
}

const InitialRoomChattingContext = {
    chattingInput: "",
    chattings: [],
    chatSending: false,
    setChattingInput: () => {},
    setChattings: () => {},
    sendChatting: () => {},
    updateChatting: () => {},
};

const RoomChattingContext = createContext<RoomChattingContextProp>(
    InitialRoomChattingContext
);
export const useRoomChattingContext = () => useContext(RoomChattingContext);

export default function RoomChattingProvider({ children }: ChildrenProp) {
    const { socketRef, userInfo, roomUsingInfo } = useAppContext();
    const { chattingOpen } = useRoomContext();
    const [chattingInput, setChattingInput] = useState<string>("");
    const [chattings, setChattings] = useState<ChattingContent[]>([]);
    const [chatSending, setChatSending] = useState<boolean>(false);
    const scrollerRef = useRef<HTMLDivElement>(null);
    const chattingInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        socketRef?.current?.on(
            SocketChannel.RECEIVE_CHATTING,
            (payload: { chattingContent: ChattingContent }) => {
                updateChatting(payload.chattingContent);
            }
        );
        return () => {
            socketRef?.current?.off(SocketChannel.RECEIVE_CHATTING);
        };
    }, []);

    async function sendChatting() {
        if (chatSending || chattingInput === "") {
            return;
        }
        setChatSending(true);
        const newChattingContent: ChattingContent = {
            user: userInfo ? userInfo : undefined,
            content: chattingInput,
            writtenTime: timeConvert(new Date()),
            key: new Date().getTime(),
        };
        await axios
            .post<{ success: boolean }>(`${API_ENDPOINT}/api/room/chat`, {
                roomId: roomUsingInfo?.roomId,
                userSeatNo: roomUsingInfo?.seatNo,
                chattingContent: newChattingContent,
            })
            .then((response) => {
                if (response.data.success) {
                    updateChatting(newChattingContent);
                    setChattingInput("");
                } else {
                    toastErrorMessage("?????? ????????? ??????????????????.");
                }
            })
            .catch((error) => {
                console.error(error);
                toastErrorMessage("?????? ????????? ??????????????????.");
            })
            .finally(() => {
                setChatSending(false);
                chattingInputRef?.current?.focus();
                if (chattingOpen) {
                    scrollerRef?.current?.scrollIntoView({
                        behavior: "smooth",
                    });
                }
                return;
            });
    }

    function timeConvert(rawTime: Date): string {
        const hour =
            rawTime.getHours() >= 10
                ? rawTime.getHours()
                : `0${rawTime.getHours()}`;
        const minute =
            rawTime.getMinutes() >= 10
                ? rawTime.getMinutes()
                : `0${rawTime.getMinutes()}`;
        return `${hour}:${minute}`;
    }

    function updateChatting(newChatting: ChattingContent) {
        // NOTE (!#useState)
        // ????????? setChattings([...chattings, newChatting]) ?????? ?????? ??? ???
        // ?????? ?????? console??? ???????????? ?????? chatting??? ????????? ??????????????? ??????
        setChattings((chattings) => [...chattings, newChatting]);
        if (chattingOpen) {
            scrollerRef?.current?.scrollIntoView({ behavior: "smooth" });
        }
        return;
    }

    const roomChattingContext = {
        chattingInput,
        chattings,
        chatSending,
        setChattingInput,
        setChattings,
        sendChatting,
        updateChatting,
        scrollerRef,
        chattingInputRef,
    };

    return (
        <RoomChattingContext.Provider value={roomChattingContext}>
            {children}
        </RoomChattingContext.Provider>
    );
}
