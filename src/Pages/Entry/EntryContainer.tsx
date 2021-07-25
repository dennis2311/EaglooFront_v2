import React, { useRef, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import { Location } from "history";
import axios from "axios";
import {
    SlideUpPageContainer,
    StylelessLink,
} from "../../Styles/StyledComponents";
import EntryHeader from "./Entry__Header";
import EntryOuterRow from "./Entry__OuterRow";
import EntryOuterColumn from "./Entry__OuterColumn";
import EntryCenterPanel from "./Entry__CenterPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINT, Room } from "../../Constants";

interface LocationStateProp {
    roomNo: number;
}

interface PanelButtonProp {
    stopSelfStream: () => void;
}

export default function EntryContainer() {
    const history = useHistory();
    const location = useLocation<Location | unknown>();
    const state = location.state as LocationStateProp;
    const roomNo = state?.roomNo;
    const userStreamRef = useRef<HTMLVideoElement>(null);
    const [room, setRoom] = useState<Room | undefined>();

    useEffect(() => {
        const state = location.state as LocationStateProp;
        if (state === undefined) {
            history.push("/list");
        }
        // const roomInfo = getRoom();
        // if (roomInfo) {
        //     console.log(roomInfo);
        //     setRoom(roomInfo);
        // }
        navigator.mediaDevices
            .getUserMedia({
                video: true,
            })
            .then((stream) => {
                userStreamRef.current!.srcObject = stream;
            });
        return () => {};
    }, []);

    // async function getRoom(): Room {
    //     await axios
    //         .get<Room>(`${API_ENDPOINT}/api/room/${roomNo}`)
    //         .then((response) => {
    //             console.log(response.data);
    //             return response.data as Room;
    //         });
    // }

    function stopSelfStream() {
        const selfStream = userStreamRef.current?.srcObject as MediaStream;
        const tracks = selfStream?.getTracks();
        if (tracks) {
            tracks.forEach((track) => {
                track.stop();
            });
        }
    }

    return (
        <>
            <OuterContainer
                onClick={() => {
                    stopSelfStream();
                    history.push("/list");
                }}
            />
            <Container>
                <EntryHeader />
                <SubContiner>
                    <EntryOuterRow room={room} seatNums={[1, 2, 3, 4, 5, 6]} />
                    <EntryInnerRow>
                        <EntryOuterColumn room={room} seatNums={[7, 9]} />
                        <EntryCenterPanel
                            userStreamRef={userStreamRef}
                            stopSelfStream={stopSelfStream}
                        />
                        <EntryOuterColumn room={room} seatNums={[8, 10]} />
                    </EntryInnerRow>
                    <EntryOuterRow
                        room={room}
                        seatNums={[11, 12, 13, 14, 15, 16]}
                    />
                </SubContiner>
                <CloseIcon stopSelfStream={stopSelfStream} />
            </Container>
        </>
    );
}

function CloseIcon({ stopSelfStream }: PanelButtonProp) {
    return (
        <EntryClose
            onClick={() => {
                stopSelfStream();
            }}
        >
            <StylelessLink to={"/list"}>
                <FontAwesomeIcon icon={faTimes} size="2x" />
            </StylelessLink>
        </EntryClose>
    );
}

export const FadeIn = keyframes`
    from{
        opacity: 0
    }
    to {
        opacity: 0.5
    }
`;

const OuterContainer = styled.div`
    animation: ${FadeIn} 0.5s ease-out;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.theme.loginMessageGray};
    opacity: 0.5;
`;

const Container = styled(SlideUpPageContainer)`
    display: flex;
    flex-direction: column;
    position: relative;
    font-family: ${(props) => props.theme.plainBoldTextFont};
    padding: 0px 80px;
    padding-top: 60px;
    padding-bottom: 30px;
`;

const SubContiner = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 85%;
`;

const EntryInnerRow = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 50%;
`;

const EntryClose = styled.div`
    position: absolute;
    top: 40px;
    right: 45px;
    color: ${(props) => props.theme.entryMainBlue};
`;