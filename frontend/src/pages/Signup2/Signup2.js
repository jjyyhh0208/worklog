import React, { useState, useEffect } from 'react';
import styles from './Signup2.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileService from '../../utils/ProfileService';
import AdminService from '../../utils/AdminService';

function Signup2({ signUpInfo, setSignUpInfo }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditing = location.state?.isEditing || false;
    const profileData = location.state?.profileData || {};

    const [selectedGender, setSelectedGender] = useState(signUpInfo.gender || profileData.gender || '');
    const [selectedAge, setSelectedAge] = useState(signUpInfo.age || profileData.age || ''); // State to hold selected age

    useEffect(() => {
        if (isEditing) {
            setSignUpInfo(profileData);
        }
    }, [isEditing, profileData, setSignUpInfo]);

    const signUpChangeHandler = (e) => {
        setSignUpInfo({ ...signUpInfo, [e.target.name]: e.target.value });
    };

    const handleNextClick = async (e) => {
        e.preventDefault();
        try {
            await ProfileService.setUserBasicInfo({
                name: signUpInfo.name === null ? signUpInfo.username : signUpInfo.name,
                age: selectedAge,
                gender: signUpInfo.gender === 'None' ? null : signUpInfo.gender,
            });
            if (isEditing) {
                navigate('/my-profile');
            } else {
                navigate('/signup/3');
            }
        } catch (error) {
            console.error('Failed to update user info:', error);
        }
        console.log(signUpInfo);
    };

    const ageOptions = [];
    for (let year = 1985; year <= 2020; year++) {
        ageOptions.push(
            <option key={year} value={year}>
                {year}
            </option>
        );
    }

    const handleAgeChange = (e) => {
        setSelectedAge(e.target.value);
    };

    const handleGenderClick = (gender) => {
        setSignUpInfo({ ...signUpInfo, gender });
        setSelectedGender(gender);
    };

    const logoHandler = () => {
        navigate('/');
    };
    const handleBackClick = () => {
        console.log(signUpInfo);
        AdminService.userDelete()
            .then(() => {
                console.log('회원탈퇴가 성공됨!!');
                navigate(-1);
            })
            .catch((error) => {
                console.error('회원 탈퇴 중 오류가 발생했습니다.', error);
            });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1} onClick={logoHandler}>
                .WORKLOG
            </h1>

            <h2 className={styles.h2}>기본프로필 등록</h2>
            <div className={styles.back}>
                <button type="submit" onClick={handleBackClick} className={styles.backBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="50" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M15.5 19l-7-7 7-7"
                            stroke="#4053ff"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
            <form className={styles.signUp}>
                <div className={styles.idbox}></div>
                <span className={styles.span}>이름</span>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="사용할 닉네임을 입력해주세요."
                    name="name"
                    value={signUpInfo.name}
                    onChange={signUpChangeHandler}
                />
                <span className={styles.span}>출생연도</span>
                <select className={styles.input} value={selectedAge} onChange={handleAgeChange}>
                    <option value="">출생연도를 선택하세요</option>
                    {ageOptions}
                </select>
                <span className={styles.span}>성별</span>
                <div className={styles.genderButtons}>
                    <button
                        type="button"
                        className={`${styles.genderButton} ${selectedGender === 'M' ? styles.selected : ''}`}
                        onClick={() => handleGenderClick('M')}
                    >
                        Male
                    </button>
                    <button
                        type="button"
                        className={`${styles.genderButton} ${selectedGender === 'F' ? styles.selected : ''}`}
                        onClick={() => handleGenderClick('F')}
                    >
                        Female
                    </button>
                    <button
                        type="button"
                        className={`${styles.genderButton} ${selectedGender === 'N' ? styles.selected : ''}`}
                        onClick={() => handleGenderClick('N')}
                    >
                        None
                    </button>
                </div>
                <div className={styles.nextbox}>
                    <div>
                        <button className={styles.nextBtn} type="button" onClick={handleNextClick}>
                            {isEditing ? '수정 완료' : 'NEXT'} {/* 수정 모드일 때 버튼 텍스트 변경 */}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Signup2;
