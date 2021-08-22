import React, {
    createContext,
    useContext,
    RefObject,
    useRef,
    useState,
    useEffect,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Location } from "history";
import { useAppContext } from "../../Routes/App/AppProvider";
import axios from "axios";
import {
    RoomType,
    Room,
    CustomRoom,
    Seat,
    PeerStateProp,
    PeerRefProp,
    Channel,
    ChildrenProp,
    API_ENDPOINT,
} from "../../Constants";
import Peer from "simple-peer";
import { toastSuccessMessage } from "../../Utils";

interface RoomLocationStateProp {
    roomType: RoomType;
    roomId: string;
    userSeatNo: number;
    endTime: number;
}

interface RoomContextProp {
    userStreamRef?: RefObject<HTMLVideoElement>;
    peersRef?: RefObject<PeerRefProp[]>;
    peersState: PeerStateProp[];
    roomType: RoomType;
    roomId: string;
    roomInfo: Room | CustomRoom;
    userSeatNo: number;
    endTime: number;
    chattingOpen: boolean;
    setPeersState: (peersState: PeerStateProp[]) => void;
    createPeer: (
        userToSignal: string,
        stream: MediaStream,
        userSeatNo: number,
        endTime: number
    ) => Peer.Instance;
    addPeer: (
        incomingSignal: Peer.SignalData,
        callerId: string,
        stream: MediaStream
    ) => Peer.Instance;
    toggleChattingOpen: () => void;
    stopSelfStream: () => void;
    exitToList: () => void;
}

const InitialRoomContext: RoomContextProp = {
    peersState: [],
    roomType: RoomType.PUBLIC,
    roomId: "",
    roomInfo: {
        id: "",
        roomName: "",
        seats: [],
    },
    userSeatNo: 0,
    endTime: 0,
    chattingOpen: false,
    setPeersState: () => {},
    createPeer: () => new Peer(),
    addPeer: () => new Peer(),
    toggleChattingOpen: () => {},
    stopSelfStream: () => {},
    exitToList: () => {},
};

const RoomContext = createContext<RoomContextProp>(InitialRoomContext);
export const useRoomContext = () => useContext(RoomContext);

export default function RoomProvider({ children }: ChildrenProp) {
    const history = useHistory();
    const location = useLocation<Location | unknown>();
    const { socketRef, userInfo } = useAppContext();
    const userStreamRef = useRef<HTMLVideoElement>(null);
    const peersRef = useRef<PeerRefProp[]>([]);
    const [peersState, setPeersState] = useState<PeerStateProp[]>([]);
    const [roomType, setRoomType] = useState<RoomType>(RoomType.PUBLIC);
    const [roomId, setRoomId] = useState<string>("");
    const [roomInfo, setRoomInfo] = useState<Room | CustomRoom>({
        id: "",
        roomName: "",
        seats: [],
    });
    const [userSeatNo, setUserSeatNo] = useState<number>(0);
    const [chattingOpen, setChattingOpen] = useState<boolean>(false);
    const [endTime, setEndTime] = useState<number>(0);

    useEffect(() => {
        // 엔트리 입장시 roomId prop을 받고 온 게 아니면 /list로 push
        const state = location.state as RoomLocationStateProp;
        if (state !== undefined) {
            getRoomInfo(state.roomType, state.roomId);
            setRoomType(state.roomType);
            setRoomId(state.roomId);
            setUserSeatNo(state.userSeatNo);
            setEndTime(state.endTime);
        } else {
            history.push("/list");
        }

        navigator.mediaDevices
            .getUserMedia({
                video: true,
            })
            .then(async (stream) => {
                userStreamRef!.current!.srcObject = stream;

                /* 1. 방 입장 요청 */
                socketRef?.current?.emit(Channel.JOIN_ROOM, {
                    roomType: state.roomType,
                    roomId: state.roomId,
                    newSeat: {
                        seatNo: state.userSeatNo,
                        socketId: "",
                        userEmail: userInfo?.email,
                        userNickName: userInfo?.nickName,
                        endTime: state.endTime,
                    },
                });

                socketRef?.current?.on(
                    Channel.GET_CURRENT_ROOM,
                    (currentRoom: Room | CustomRoom) => {
                        // console.log(`기존 방 정보 수신 :`);
                        // console.dir(currentRoom.seats);
                        if (!!currentRoom.seats) {
                            const peers: PeerStateProp[] = [];

                            currentRoom.seats.forEach((seat) => {
                                if (seat.socketId !== socketRef?.current?.id) {
                                    const peer = createPeer(
                                        seat.socketId,
                                        stream,
                                        state.userSeatNo,
                                        state.endTime
                                    );
                                    peersRef?.current?.push({
                                        peer,
                                        seatInfo: seat,
                                    });
                                    peers.push({
                                        peer,
                                        seatInfo: seat,
                                    });
                                }
                            });

                            setPeersState(peers);
                        }
                    }
                );

                /* 4. 새 유저가 접속한경우 */
                socketRef?.current?.on(
                    Channel.PEER_CONNECTION_REQUESTED,
                    (payload: {
                        signal: Peer.SignalData;
                        callerSeatInfo: Seat;
                    }) => {
                        // console.log(
                        //     `${payload.callerSeatInfo.socketId}(${payload.callerSeatInfo.seatNo}번 참여자)로부터 연결 요청`
                        // );
                        const peer = addPeer(
                            payload.signal,
                            payload.callerSeatInfo.socketId,
                            stream
                        );
                        peersRef?.current?.push({
                            peer,
                            seatInfo: payload.callerSeatInfo,
                        });
                        // TODO (BUG?) RoomContainer에서 peersState 이전 상태 가져올 때 implicitly any type이 됨.
                        setPeersState((peersState) => [
                            ...peersState,
                            {
                                peer: peer,
                                seatInfo: payload.callerSeatInfo,
                            },
                        ]);
                    }
                );

                /* 6. 최종 연결 */
                socketRef?.current?.on(
                    Channel.PEER_CONNECTION_REQUEST_ACCEPTED,
                    (payload) => {
                        // console.log(`${payload.id}가 연결 요청을 수락`);
                        const peerRef = peersRef?.current?.find(
                            (peer) => peer.seatInfo.socketId === payload.id
                        );
                        peerRef?.peer.signal(payload.signal);
                    }
                );

                /* 다른 유저 퇴장시 */
                socketRef?.current?.on(Channel.PEER_QUIT_ROOM, (seatNo) => {
                    // console.log(`${seatNo}번 참여자 퇴장`);
                    // document.getElementById(`room-${seatNo}`)?.remove();
                    setPeersState((peersState) =>
                        peersState.filter((peer) => {
                            return peer.seatInfo.seatNo !== seatNo;
                        })
                    );
                    const exitPeer = peersRef?.current?.find((peer) => {
                        peer.seatInfo.seatNo === seatNo;
                    });
                    if (!!exitPeer) {
                        exitPeer.peer.destroy();
                    }
                    // peersRef?.current = peersRef?.current?.filter((peer) => {
                    //     peer.seatNo !== seatNo;
                    // });
                });
            });

        const timeOver = setTimeout(() => {
            toastSuccessMessage(
                "설정한 공부 시간이 다 되어 퇴실 되었습니다. 보람찬 시간이었나요?"
            );
            stopSelfStream();
            exitToList();
        }, state.endTime - new Date().getTime());

        return () => {
            clearTimeout(timeOver);
            socketRef?.current?.emit(Channel.QUIT_ROOM, {
                roomId: state.roomId,
                seatNo: state.userSeatNo,
            });
            socketRef?.current?.off(Channel.GET_CURRENT_ROOM);
            socketRef?.current?.off(Channel.PEER_CONNECTION_REQUESTED);
            socketRef?.current?.off(Channel.PEER_CONNECTION_REQUEST_ACCEPTED);
            socketRef?.current?.off(Channel.PEER_QUIT_ROOM);
        };
    }, []);

    async function getRoomInfo(roomType: RoomType, roomId: string) {
        await axios
            .get<Room | CustomRoom>(`${API_ENDPOINT}/api/room/${roomId}`)
            .then((response) => {
                setRoomInfo(response.data);
            });
    }

    /* 자신이 방에 들어왔을 때 기존 참여자들과의 Connection 설정 */
    function createPeer(
        userToSignal: string, // 기존 참여자 socket ID
        stream: MediaStream, // 본인 stream
        userSeatNo: number,
        endTime: number
    ) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });
        peer.on("signal", (signal: Peer.SignalData) => {
            /* 3. 기존 사용자에게 연결 요청 */
            // console.log(`${userToSignal}에게 연결 요청`);
            socketRef?.current?.emit(Channel.REQUEST_PEER_CONNECTION, {
                userToSignal,
                signal,
                callerSeatInfo: {
                    seatNo: userSeatNo,
                    socketId: socketRef?.current?.id,
                    userEmail: userInfo?.email,
                    userNickName: userInfo?.nickName,
                    endTime,
                },
            });
        });
        return peer;
    }

    function addPeer(
        incomingSignal: Peer.SignalData,
        callerId: string, // 신규 참여자 socket ID
        stream: MediaStream
    ) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        /* 5. 연결 요청 수락 */
        peer.on("signal", (signal: Peer.SignalData) => {
            // console.log(`${callerId}의 연결 요청 수락`);
            socketRef?.current?.emit(Channel.ACCEPT_PEER_CONNECTION_REQUEST, {
                signal,
                callerId,
            });
        });
        peer.signal(incomingSignal);
        return peer;
    }

    function toggleChattingOpen() {
        setChattingOpen(!chattingOpen);
    }

    function stopSelfStream() {
        const selfStream = userStreamRef?.current?.srcObject as MediaStream;
        const tracks = selfStream?.getTracks();
        if (tracks) {
            tracks.forEach((track) => {
                track.stop();
            });
        }
    }

    function exitToList() {
        history.push("/list");
    }

    const roomContext = {
        userStreamRef,
        peersRef,
        peersState,
        roomType,
        roomId,
        roomInfo,
        userSeatNo,
        endTime,
        chattingOpen,
        setPeersState,
        createPeer,
        addPeer,
        toggleChattingOpen,
        stopSelfStream,
        exitToList,
    };

    return (
        <RoomContext.Provider value={roomContext}>
            {children}
        </RoomContext.Provider>
    );
}
