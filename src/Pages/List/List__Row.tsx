import React from "react";
import styled from "styled-components";
import { useListContext } from "./ListProvider";
import { Room, CustomRoom, RoomType } from "../../Constants";
import CircularProgress from "@material-ui/core/CircularProgress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import fatIcon from "../../Resources/Img/icon-fat.png";

interface PublicRoomButtonProp {
    room: Room;
}

interface CustomRoomButtonProp {
    room: CustomRoom;
}

interface RoomTypeProp {
    roomType: RoomType;
}

export default function ListRow({ roomType }: RoomTypeProp) {
    return (
        <Container>
            <Title roomType={roomType} />
            <RoomButtonRow roomType={roomType} />
        </Container>
    );
}

function Title({ roomType }: RoomTypeProp) {
    if (roomType === RoomType.PUBLIC) {
        return (
            <TitleContainer>
                <PublicRoomFormerTitle>{`기본 `} </PublicRoomFormerTitle>
                <PublicRoomRearTitle>{`스터디룸`}</PublicRoomRearTitle>
            </TitleContainer>
        );
    }

    if (roomType === RoomType.CUSTOM) {
        return (
            <TitleContainer>
                <CustomRoomFormerTitle>{`사용자 설정 `}</CustomRoomFormerTitle>
                <CustomRoomRearTitle>{`스터디룸`}</CustomRoomRearTitle>
            </TitleContainer>
        );
    }

    return null;
}

function RoomButtonRow({ roomType }: RoomTypeProp) {
    const { loadingRooms, publicRooms, customRooms } = useListContext();

    if (loadingRooms) {
        return <LoadingMessage />;
    }

    if (roomType === RoomType.PUBLIC) {
        return (
            <RoomButtonRowContainer>
                {publicRooms.map((publicRoom) => {
                    return (
                        <PublicRoomButton
                            room={publicRoom}
                            key={`publicRoom_${publicRoom.id}_button`}
                        />
                    );
                })}
            </RoomButtonRowContainer>
        );
    }

    if (roomType === RoomType.CUSTOM) {
        return (
            <RoomButtonRowContainer>
                {customRooms.map((customRoom) => {
                    return (
                        <CustomRoomButton
                            room={customRoom}
                            key={`customRoom_${customRoom.id}_button`}
                        />
                    );
                })}
            </RoomButtonRowContainer>
        );
    }

    return null;
}

function LoadingMessage() {
    return (
        <LoadingMessageContainer>
            <LoadingIcon>
                <CircularProgress color="inherit" size={40} thickness={5} />
            </LoadingIcon>
            {`방 정보를 불러오는 중입니다`}
        </LoadingMessageContainer>
    );
}

function PublicRoomButton({ room }: PublicRoomButtonProp) {
    const { enterEntry } = useListContext();

    return (
        <RoomButtonContainer
            onClick={() => {
                enterEntry(RoomType.PUBLIC, room.id);
            }}
        >
            <RoomButtonIcon src={fatIcon} />
            <RoomButtonTitle>{`${room.roomName}`}</RoomButtonTitle>
            {/* <RoomButtonMessage>
                {`이글루에서 제공하는 스터디룸`}
            </RoomButtonMessage> */}
            <RoomButtomInfo currentSeats={room.seats.length} maxSeats={14}>
                <FontAwesomeIcon icon={faUserAlt} size="1x" />
                {`${room.seats.length}/14`}
            </RoomButtomInfo>
        </RoomButtonContainer>
    );
}

function CustomRoomButton({ room }: CustomRoomButtonProp) {
    const { enterEntry } = useListContext();

    return (
        <RoomButtonContainer
            onClick={() => {
                enterEntry(RoomType.CUSTOM, room.id);
            }}
        >
            <RoomButtonIcon src={fatIcon} />
            <RoomButtonTitle>{`${room.roomName}`}</RoomButtonTitle>
            <RoomButtonMessage>
                {!!room.roomDescription ? room.roomDescription : ""}
            </RoomButtonMessage>
            {/* TODO (enhancement) - 추후 list 및 entry 에서 사용자 설정방 최대 인원수 하드코딩하지 말고 변수로 가져올 것 */}
            <RoomButtomInfo currentSeats={room.seats.length} maxSeats={14}>
                <FontAwesomeIcon icon={faUserAlt} size="1x" />
                {`${room.seats.length}/14`}
            </RoomButtomInfo>
        </RoomButtonContainer>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    font-family: ${(props) => props.theme.plainBoldTextFont};
    padding-right: 25px;
`;

const TitleContainer = styled.div`
    font-size: 28px;
    margin-bottom: 32px;
`;

const LoadingMessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100vw * 0.18);
    color: ${(props) => props.theme.entryLightBlue};
    font-size: 20px;
    margin-bottom: 70px;
`;

const LoadingIcon = styled.div`
    margin-bottom: 50px;
`;

const PublicRoomFormerTitle = styled.span`
    color: ${(props) => props.theme.entryMainBlue};
`;

const PublicRoomRearTitle = styled.span`
    color: ${(props) => props.theme.entryLightBlue};
`;

const CustomRoomFormerTitle = styled.span`
    color: ${(props) => props.theme.listMainOrange};
`;

const CustomRoomRearTitle = styled.span`
    color: ${(props) => props.theme.listLightOrange};
`;

const RoomButtonRowContainer = styled.div`
    display: flex;
    // 내부 컴포넌트 크기가 커지면 행을 바꿈
    flex-wrap: wrap;
`;

const RoomButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: ${(props) => props.theme.mainBlue};
    width: 20%;
    margin-bottom: 70px;
    :hover {
        cursor: pointer;
    }
`;

// const RoomButtonIcon = styled.div`
//     width: 90%;
//     aspect-ratio: 1;
//     background-color: ${(props) => props.theme.loginMessageGray};
//     border-radius: 18%;
//     margin-bottom: 15px;
// `;

const RoomButtonIcon = styled.img`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    aspect-ratio: 1;
    border-radius: 18%;
    padding: 0px 12px;
    margin-bottom: 15px;
    overflow: hidden;
`;

const RoomButtonTitle = styled.div`
    font-size: 18px;
    @media (max-width: ${(props) => props.theme.tabletWidth}) {
        font-size: 15px;
    }
    margin-bottom: 12px;
`;

const RoomButtonMessage = styled.div`
    font-size: 10px;
    margin-bottom: 15px;
`;

interface RoomButtonInfoProp {
    currentSeats: number;
    maxSeats: number;
}

const RoomButtomInfo = styled.div<RoomButtonInfoProp>`
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    width: 50px;
    color: ${(props) =>
        props.currentSeats >= props.maxSeats && props.theme.listMainOrange};
`;
