import { RefObject } from "react";
import Peer from "simple-peer";

// 모든 Provider 공통
export interface ChildrenProp {
    children: JSX.Element;
}

export interface User {
    id: string;
    email: string;
    nickName?: string;
}

export interface Task {
    id: string;
    content: string;
    importance: number;
    done: boolean;
}

// 방 종류 : List, Entry, Room 에서 모두 사용
export enum RoomType {
    PUBLIC = "PUBLIC",
    CUSTOM = "CUSTOM",
}

// 방에서 사용하는 simple-peer 라이브러리 prop
export interface RoomParentProp {
    peersState: PeerStateProp[];
    userStreamRef: RefObject<HTMLVideoElement>;
    stopSelfStreamAndExit: () => void;
}

export interface PeerStateProp {
    peer: Peer.Instance;
    seatNo: number;
}

export interface PeerRefProp {
    peer: Peer.Instance;
    socketId: string;
    seatNo: number;
}

export interface Seat {
    seatNo: number;
    socketId: string;
    userName?: string;
}

export interface Room {
    id: string;
    roomName: string;
    roomDescription?: string;
    seats: Seat[];
}

export interface CustomRoom {
    id: string;
    roomName: string;
    roomDescription: string;
    ownerId: string;
    openToPublic: boolean;
    usePassword: boolean;
    password: string;
    enableMic: boolean;
    seats: Seat[];
}

export interface ChattingContent {
    user: User | undefined;
    content: string;
    writtenTime: string;
    key: number;
}
