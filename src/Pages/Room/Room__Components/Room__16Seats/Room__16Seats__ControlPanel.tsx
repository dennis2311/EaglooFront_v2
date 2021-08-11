import React, { RefObject } from "react";
import styled from "styled-components";
import { useRoomContext } from "../../RoomProvider";
import RoomChatting from "../Room__Chatting";
import { RoomParentProp, PeerStateProp, RoomType } from "../../../../Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlock, faUserAlt } from "@fortawesome/free-solid-svg-icons";

interface StreamProp {
    userStreamRef: RefObject<HTMLVideoElement>;
}

interface PanelButtonProp {
    peersState: PeerStateProp[];
    stopSelfStreamAndExit: () => void;
}

export function Room16SeatsControlPanel({
    peersState,
    userStreamRef,
    stopSelfStreamAndExit,
}: RoomParentProp) {
    return (
        <Container>
            <UserStream userStreamRef={userStreamRef} />
            <ControlButtons
                peersState={peersState}
                stopSelfStreamAndExit={stopSelfStreamAndExit}
            />
        </Container>
    );
}

function UserStream({ userStreamRef }: StreamProp) {
    return (
        <CamContainer>
            <UserCam ref={userStreamRef} autoPlay playsInline />
        </CamContainer>
    );
}

function ControlButtons({
    peersState,
    stopSelfStreamAndExit,
}: PanelButtonProp) {
    const { roomType, roomInfo, userSeatNo } = useRoomContext();
    return (
        <ControlButtonContainer>
            <RoomInfo>
                <RoomName>
                    <FontAwesomeIcon icon={faUnlock} />
                    {`  ${roomInfo.roomName}`}
                </RoomName>
                <RoomPeople>
                    <FontAwesomeIcon icon={faUserAlt} />
                    {`  ${peersState.length + 1}/16`}
                </RoomPeople>
            </RoomInfo>
            <MySeat>{`내 자리 : ${userSeatNo}번`}</MySeat>
            <ExitButton
                onClick={() => {
                    stopSelfStreamAndExit();
                }}
            >
                {`나가기`}
            </ExitButton>
        </ControlButtonContainer>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 68.4%;
    height: 100%;
`;

const CamContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 42%;
    height: 92.5%;
    background-color: black;
    border-radius: 15px;
    overflow: hidden;
`;

const UserCam = styled.video`
    max-width: 100%;
    max-height: 100%;
`;

const ControlButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 42%;
    height: 92.5%;
    padding: 24px 0px;
`;

const RoomInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 35px;
    font-family: ${(props) => props.theme.plainBoldTextFont};
`;

const RoomName = styled.div`
    font-size: 30px;
    color: white;
`;

const RoomPeople = styled.div`
    font-size: 20px;
    color: ${(props) => props.theme.loginMessageGray};
`;

const MySeat = styled.div`
    font-size: 20px;
    color: white;
`;

const ExitButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 130px;
    height: 45px;
    color: white;
    font-size: 24px;
    font-family: ${(props) => props.theme.inButtonFont};
    border-radius: 15px;
    background: ${(props) => props.theme.orangeGradient};
    :hover {
        cursor: pointer;
    }
`;