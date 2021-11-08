import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ConnectedUser, API_ENDPOINT } from "../../Constants";
import HomeImg__Yonsei from "../../Resources/Img/HomeImg__Yonsei-min.png";

interface HomeBannerProp {
    background_image: boolean;
}


export default function HomeBanner({background_image}:HomeBannerProp) {
    const [connectedUserNum, setConnectedUserNum] = useState<number>(0);

    useEffect(() => {
        getAllConnectedUser();
        return () => {};
    }, []);

    async function getAllConnectedUser() {
        await axios
            .get<ConnectedUser[]>(`${API_ENDPOINT}/api/user/connected`)
            .then((response) => {
                setConnectedUserNum(response.data.length);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <>
            {background_image ?
            (<HomeImgContainer>
                <HomeImg src={HomeImg__Yonsei} alt="Yonsei Univ Image" />
            </HomeImgContainer>) : <></>
            }
            <AnnouncementContainer />
            <Announcement>
                <body>
                    <AnnouncementHeader>
                        {`* 모바일 접속에 대한 공지 *`}
                    </AnnouncementHeader>
                    <br />
                    <AnnouncementContent>
                        {` 안녕하세요, EAGLOO 프로젝트를 진행중인 팀 꼼지락입니다.`}
                    </AnnouncementContent>
                    <br />
                    <br />
                    <AnnouncementContent>{` 현재`}</AnnouncementContent>
                    <AnnouncementContentYellow>{` 모바일`}</AnnouncementContentYellow>
                    <AnnouncementContent>{`로 접속할 경우 일정 시간이 지나면 스터디룸에서 튕겨나가`}</AnnouncementContent>
                    <AnnouncementContentYellow>{` 인원수가 0이 되고 새로운 사람이 입장해도 기존 참가자를 볼 수 없는 버그`}</AnnouncementContentYellow>
                    <AnnouncementContent>{`가 확인되었습니다.`}</AnnouncementContent>
                    <br />
                    <br />
                    <AnnouncementContent>{` PC로 접속한 경우엔 아직까지 해당 문제점이 발생한 사례가 없어, 가능하면`}</AnnouncementContent>
                    <AnnouncementContentYellow>{` PC를 통한 접속을 권고`}</AnnouncementContentYellow>
                    <AnnouncementContent>{`해 드립니다. 모바일로 접속시 혼자인 것 같은 느낌이 들 때에는 방을 나갔다가 다시 입장 부탁드립니다. 이용에 불편을 드려 죄송합니다.`}</AnnouncementContent>
                    <br />
                    <br />
                    <br />
                    <AnnouncementConnectedUser>{`현재 접속자 수 : ${connectedUserNum} 명`}</AnnouncementConnectedUser>
                    <AnnouncementConnectedUserRefresh>{`   (페이지 새로고침으로 갱신)`}</AnnouncementConnectedUserRefresh>
                </body>
            </Announcement>
        </>
    );
}

const HomeImgContainer = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    height: 480px;
    text-align: right;
    opacity: 0.4;
    overflow: hidden;
`;

const HomeImg = styled.img`
    max-width: 100%;
    max-height: 100%;
    border-radius: 35px;
`;

const AnnouncementContainer = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    width: 320px;
    height: 365px;
    background-color: ${(props) => props.theme.entryLightBlue};
    opacity: 0.4;
`;

const Announcement = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    width: 320px;
    height: 200px;
    padding: 15px;
    font-family: ${(props) => props.theme.plainTextFont};
    color: white;
`;

const AnnouncementHeader = styled.p`
    font-size: 20px;
    font-family: ${(props) => props.theme.plainBoldTextFont};
`;

const AnnouncementContent = styled.span`
    font-size: 16px;
    line-height: 18px;
`;

const AnnouncementContentYellow = styled(AnnouncementContent)`
    color: yellow;
`;

const AnnouncementConnectedUser = styled(AnnouncementContent)`
    font-size: 18px;
    font-family: ${(props) => props.theme.plainBoldTextFont};
`;

const AnnouncementConnectedUserRefresh = styled(AnnouncementContent)`
    font-size: 10px;
`;
