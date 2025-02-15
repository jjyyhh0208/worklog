import React, { useState, useEffect } from 'react';
import ProfileService from '../../utils/ProfileService';

const KakaoShareButton = ({ username }) => {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(process.env.REACT_APP_KAKAO_APP_KEY);
        }
        const fetchProfileData = async () => {
            try {
                const data = await ProfileService.fetchFriendProfile(username);
                setProfileData(data);
            } catch (error) {}
        };

        fetchProfileData();
    }, [username]);

    const shareToKakao = () => {
        if (!profileData) return;

        window.Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '.WORKLOG - 익명 팀원 피드백 서비스',
                description: `피드백 접근 코드: ${profileData.access_code}\n${profileData.name}님이 더 발전할 수 있도록, 협업 피드백을 남겨주세요.`,
                imageUrl: 'https://dot-worklog.com/images/logo.png?v=1',
                link: {
                    mobileWebUrl: `https://dot-worklog.com/friend-profile/${username}`,
                    webUrl: `https://dot-worklog.com/friend-profile/${username}`,
                    // 실제 배포시에는 https://dot-worklog.com으로 변경
                },
            },
            buttons: [
                {
                    title: '웹으로 보기',
                    link: {
                        mobileWebUrl: `https://dot-worklog.com/friend-profile/${username}`,
                        webUrl: `https://dot-worklog.com/friend-profile/${username}`,
                        // 실제 배포시에는 https://dot-worklog.com으로 변경
                    },
                },
            ],
        });
    };

    return (
        <a
            href="#"
            className="w-full h-full flex items-center justify-center"
            onClick={(e) => {
                e.preventDefault();
                shareToKakao();
            }}
        >
            <img src="/images/kakao.png" alt="Kakao" className="w-6 h-6" />
        </a>
    );
};

export default KakaoShareButton;
