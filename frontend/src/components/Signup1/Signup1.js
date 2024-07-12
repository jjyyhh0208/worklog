import React, { useState } from 'react';
import styles from './Signup1.module.css';
import AdminService from '../../utils/AdminService';
import { useNavigate } from 'react-router-dom';

function Signup1({ signUpInfo, setSignUpInfo }) {
    const [error, setError] = useState('');
    const [isIdAvailable, setIsIdAvailable] = useState(null);
    const navigate = useNavigate();

    const signUpChangeHandler = (e) => {
        setSignUpInfo({ ...signUpInfo, [e.target.name]: e.target.value });
    };

    const checkUserNameHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await AdminService.checkUserName({
                username: signUpInfo.username,
            });

            if (response.data.isUnique) {
                alert('사용 가능한 아이디입니다.');
                setIsIdAvailable(true);
            } else {
                alert('아이디가 중복되어 사용 불가합니다. 다른 아이디를 입력해주세요.');
            }
        } catch (error) {
            setError(error);
            alert(`${error.message}`);
        }
    };

    const signUpHandler = async (e) => {
        e.preventDefault();

        if (!isIdAvailable) {
            alert('아이디 중복 확인이 필요합니다.');
            return;
        }

        try {
            await AdminService.registerUser({
                username: signUpInfo.username,
                password1: signUpInfo.password1,
                password2: signUpInfo.password2,
            });

            // 회원가입이 성공했을 때 로그인을 시도
            await AdminService.login({
                username: signUpInfo.username,
                password: signUpInfo.password1,
            });

            navigate('/signup/2');
        } catch (error) {
            console.error(error);
            setError(error);
            alert(`${error.message}`);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>.WORKLOG</h1>
            <h2 className={styles.h2}>SIGN UP</h2>
            <form className={styles.signUp} onSubmit={signUpHandler}>
                <div className={styles.idbox}>
                    <button className={styles.duplicatebtn} type="button" onClick={checkUserNameHandler}>
                        중복 확인
                    </button>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
                            <g clipPath="url(#clip0_231_547)">
                                <path
                                    d="M12.5 1.06104C5.81265 1.06104 0.390625 6.48501 0.390625 13.1704C0.390625 19.8597 5.81265 25.2798 12.5 25.2798C19.1874 25.2798 24.6094 19.8597 24.6094 13.1704C24.6094 6.48501 19.1874 1.06104 12.5 1.06104ZM12.5 6.43213C13.6326 6.43213 14.5508 7.35029 14.5508 8.48291C14.5508 9.61553 13.6326 10.5337 12.5 10.5337C11.3674 10.5337 10.4492 9.61553 10.4492 8.48291C10.4492 7.35029 11.3674 6.43213 12.5 6.43213ZM15.2344 18.8345C15.2344 19.1581 14.972 19.4204 14.6484 19.4204H10.3516C10.028 19.4204 9.76562 19.1581 9.76562 18.8345V17.6626C9.76562 17.339 10.028 17.0767 10.3516 17.0767H10.9375V13.9517H10.3516C10.028 13.9517 9.76562 13.6893 9.76562 13.3657V12.1938C9.76562 11.8703 10.028 11.6079 10.3516 11.6079H13.4766C13.8001 11.6079 14.0625 11.8703 14.0625 12.1938V17.0767H14.6484C14.972 17.0767 15.2344 17.339 15.2344 17.6626V18.8345Z"
                                    fill="#29A02D"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_231_547">
                                    <rect width="25" height="25" fill="white" transform="translate(0 0.67041)" />
                                </clipPath>
                            </defs>
                        </svg>
                        <span>아이디는 최초 설정 이후 변경이 불가합니다.</span>
                    </div>
                </div>
                <span className={styles.span}>아이디</span>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="영문자, 숫자 외 문자는 포함될 수 없습니다"
                    name="username"
                    value={signUpInfo.username}
                    onChange={signUpChangeHandler}
                />
                <span className={styles.span}>비밀번호</span>
                <input
                    className={styles.input}
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    name="password1"
                    value={signUpInfo.password1}
                    onChange={signUpChangeHandler}
                />
                <span className={styles.span}>비밀번호 재입력</span>
                <input
                    className={styles.input}
                    type="password"
                    placeholder="비밀번호를 다시 입력해주세요"
                    name="password2"
                    value={signUpInfo.password2}
                    onChange={signUpChangeHandler}
                />

                <div className={styles.nextbox}>
                    <button className={styles.nextBtn} type="submit">
                        NEXT
                    </button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                        <path
                            d="M25.0314 27.7727L7.97165 48.5912C6.79252 50.0301 4.88585 50.0301 3.71927 48.5912L0.884345 45.1317C-0.294782 43.6927 -0.294782 41.366 0.884345 39.9424L12.9767 25.1857L0.884345 10.4291C-0.294782 8.99015 -0.294782 6.66338 0.884345 5.23976L3.70672 1.7496C4.88585 0.310679 6.79252 0.310679 7.95911 1.7496L25.0188 22.5681C26.2105 24.007 26.2105 26.3338 25.0314 27.7727ZM49.1157 22.5681L32.0559 1.7496C30.8768 0.310679 28.9701 0.310679 27.8036 1.7496L24.9686 5.20915C23.7895 6.64807 23.7895 8.97485 24.9686 10.3985L37.061 25.1551L24.9686 39.9117C23.7895 41.3507 23.7895 43.6774 24.9686 45.1011L27.8036 48.5606C28.9827 49.9995 30.8894 49.9995 32.0559 48.5606L49.1157 27.7421C50.2948 26.3338 50.2948 24.007 49.1157 22.5681Z"
                            fill="#4053FF"
                        />
                    </svg>
                </div>
            </form>
        </div>
    );
}

export default Signup1;
