import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileService from '../../utils/ProfileService';

function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [resultsWithImages, setResultsWithImages] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 9;
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = resultsWithImages.slice(indexOfFirstResult, indexOfLastResult);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('q');
        if (query) {
            setSearchTerm(query);
            handleSearch(query);
        } else {
            // 쿼리 파라미터가 없으면 초기 상태로 설정
            setHasSearched(false);
            setNotFound(false);
            setResultsWithImages([]);
        }
        fetchCurrentUser();
        window.scrollTo(0, 0);
    }, [location.search]);

    const fetchCurrentUser = async () => {
        try {
            const userProfile = await ProfileService.fetchUserProfile();
            setCurrentUser(userProfile);
        } catch (error) {}
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setNotFound(false);
        setIsOwnProfile(false);
        setHasSearched(true); // 입력이 시작되면 hasSearched를 true로 설정
        navigate(`?q=${value}`);
    };

    const handleSearch = async (query) => {
        setHasSearched(true);
        try {
            if (currentUser && query === currentUser.username) {
                setIsOwnProfile(true);
                setSearchResults([]);
                setNotFound(false);
                return;
            }

            const results = await ProfileService.fetchSearchResults(query);

            if (results.length > 0) {
                const resultsWithImages = await Promise.all(
                    results.map(async (result) => {
                        if (result.profile_image) {
                            try {
                                const imageUrl = await ProfileService.getSignedImageUrl(result.profile_image.image);
                                return { ...result, profileImage: imageUrl };
                            } catch (error) {
                                return result;
                            }
                        } else {
                            return result;
                        }
                    })
                );
                setResultsWithImages(resultsWithImages);
                setNotFound(false);
            } else {
                setResultsWithImages([]);
                setNotFound(true);
            }
        } catch (error) {
            setResultsWithImages([]);
            setNotFound(true);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch(searchTerm);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleProfileClick = (username) => {
        if (currentUser && username === currentUser.username) {
            navigate('/my-profile');
        } else {
            navigate(`/friend-profile/${username}?q=${searchTerm}`); // search term도 같이 전송 (뒤로 가기를 구현하기 위함)
        }
    };
    const handleFollowClick = async (username, isFollowing) => {
        try {
            if (isFollowing) {
                await ProfileService.unfollowUser(username);
            } else {
                await ProfileService.followUser(username);
            }
            const updatedResults = await ProfileService.fetchSearchResults(searchTerm);
            setSearchResults(updatedResults);
        } catch (error) {}
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(searchTerm);
        }
    };

    return (
        <div className="flex flex-col items-center bg-[#F6F6F6] w-full min-h-screen pt-8  mt-16">
            <div className="flex items-center gap-2 mb-8">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="알고 싶은 동료의 ID 또는 닉네임을 입력하세요"
                    className="w-96 sm:w-112 p-2 border-2 border-gray-300 rounded-md"
                />

                <button
                    onClick={handleSearch}
                    className="bg-transparent border-none cursor-pointer hover:bg-gray-200 p-1 rounded-full"
                ></button>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 50 50" fill="none">
                    <path
                        d="M21.6787 0.0619393C9.72446 0.0619393 0 9.7864 0 21.7407C0 33.695 9.72446 43.4194 21.6787 43.4194C25.3332 43.4194 28.9256 42.5523 31.9607 40.8799C32.2038 41.1725 32.4733 41.442 32.7659 41.6851L38.9598 47.879C39.5317 48.5226 40.2291 49.0425 41.0093 49.4067C41.7894 49.771 42.6357 49.9719 43.4963 49.9973C44.3569 50.0226 45.2136 49.8718 46.0138 49.554C46.814 49.2363 47.5408 48.7584 48.1496 48.1496C48.7584 47.5408 49.2363 46.814 49.554 46.0138C49.8718 45.2136 50.0226 44.3569 49.9973 43.4963C49.9719 42.6357 49.771 41.7894 49.4067 41.0093C49.0425 40.2292 48.5226 39.5317 47.879 38.9598L41.6851 32.7659C41.3834 32.464 41.0513 32.1942 40.6941 31.9607C42.3664 28.9256 43.4194 25.3951 43.4194 21.6787C43.4194 9.72446 33.695 0 21.7407 0L21.6787 0.0619393ZM21.6787 6.25586C30.2883 6.25586 37.1635 13.1311 37.1635 21.7407C37.1635 25.8287 35.677 29.607 33.0756 32.3942C33.0136 32.4562 32.9517 32.5181 32.8897 32.58C32.5972 32.8232 32.3276 33.0927 32.0845 33.3853C29.3592 35.8628 25.6428 37.2874 21.6168 37.2874C13.0072 37.2874 6.13199 30.4122 6.13199 21.8026C6.13199 13.1931 13.0072 6.3178 21.6168 6.3178L21.6787 6.25586Z"
                        fill="black"
                    />
                </svg>
            </div>
            {isOwnProfile && (
                <div className="text-center mt-5">
                    <h3 className="text-xl font-medium">자기 자신과 더 친해지는 건 언제나 환영이에요.</h3>
                </div>
            )}
            {resultsWithImages.length > 0 && !isOwnProfile && (
                <>
                    <div className="flex flex-wrap justify-center gap-8 mb-8 max-w-4xl">
                        {currentResults.map((result) => (
                            <div
                                key={result.username}
                                className="bg-white border border-gray-300 rounded-3xl p-5 flex flex-col items-center cursor-pointer duration-300 transform hover:scale-105 shadow-md w-60 h-72 relative"
                                onClick={() => handleProfileClick(result.username)}
                            >
                                {!result.is_following && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        viewBox="0 0 47 47"
                                        fill="none"
                                        className="absolute top-2 right-2 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFollowClick(result.username, result.is_following);
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.querySelectorAll('path').forEach((path) => {
                                                path.style.fill = '#4053FF';
                                            });
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.querySelectorAll('path').forEach((path) => {
                                                path.style.fill = '#292D32';
                                            });
                                        }}
                                    >
                                        <path
                                            d="M23.5001 44.5524C11.8872 44.5524 2.448 35.1132 2.448 23.5003C2.448 11.8874 11.8872 2.44824 23.5001 2.44824C35.113 2.44824 44.5522 11.8874 44.5522 23.5003C44.5522 35.1132 35.113 44.5524 23.5001 44.5524ZM23.5001 5.38574C13.5126 5.38574 5.3855 13.5128 5.3855 23.5003C5.3855 33.4878 13.5126 41.6149 23.5001 41.6149C33.4876 41.6149 41.6147 33.4878 41.6147 23.5003C41.6147 13.5128 33.4876 5.38574 23.5001 5.38574Z"
                                            fill="#292D32"
                                        />
                                        <path
                                            d="M31.3334 24.9688H15.6667C14.8638 24.9688 14.198 24.3029 14.198 23.5C14.198 22.6971 14.8638 22.0312 15.6667 22.0312H31.3334C32.1363 22.0312 32.8022 22.6971 32.8022 23.5C32.8022 24.3029 32.1363 24.9688 31.3334 24.9688Z"
                                            fill="#292D32"
                                        />
                                        <path
                                            d="M23.5 32.8024C22.6971 32.8024 22.0312 32.1366 22.0312 31.3337V15.667C22.0312 14.8641 22.6971 14.1982 23.5 14.1982C24.3029 14.1982 24.9688 14.8641 24.9688 15.667V31.3337C24.9688 32.1366 24.3029 32.8024 23.5 32.8024Z"
                                            fill="#292D32"
                                        />
                                    </svg>
                                )}
                                <img
                                    src={result.profileImage || '/images/basicProfile.png'}
                                    alt="Profile"
                                    className="rounded-full h-28 w-28 mb-2 mt-5 border border-grey-300"
                                    onError={(e) => (e.currentTarget.src = '/images/basicProfile.png')}
                                />
                                <h2 className="text-lg font-bold mb-1">{result.name}</h2>
                                <p className="text-sm text-gray-600 mb-3">ID: {result.username}</p>
                                <div className="mt-auto">
                                    <button className="bg-yellow-400 text-white font-bold py-2 px-4 rounded hover:bg-yellow-500">
                                        프로필 보러 가기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {resultsWithImages.length > resultsPerPage && (
                        <div className="flex justify-center items-center  space-x-4 mb-4">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-full bg-white border border-gray-300 shadow-sm transition-colors duration-200 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <span className="text-sm text-gray-700">
                                {currentPage} / {Math.ceil(resultsWithImages.length / resultsPerPage)}
                            </span>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === Math.ceil(resultsWithImages.length / resultsPerPage)}
                                className="p-2 rounded-full bg-white border border-gray-300 shadow-sm transition-colors duration-200 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </>
            )}
            {hasSearched && notFound && !isOwnProfile && searchTerm !== '' && (
                <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-2">'{searchTerm}'를 찾을 수 없습니다.</h3>
                    <p className="text-gray-600 mb-1">입력하신 아이디로 등록한 회원이 없습니다.</p>
                    <p className="text-gray-600">
                        링크를 통해 친구 프로필을 찾거나, 다시 한 번 아이디를 확인해 주세요.
                    </p>
                </div>
            )}
        </div>
    );
}

export default Search;
