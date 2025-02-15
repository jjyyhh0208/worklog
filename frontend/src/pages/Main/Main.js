import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import typeData from '../../data/typeData.json';

function Main() {
    const refs = useRef(typeData.types.map(() => React.createRef()));

    const scrollToSection = (index) => {
        const offset = 100;
        const top = refs.current[index].current.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    const iconMapping = {
        '목표 달성자': 'fa-bullseye',
        불도저: 'fa-tachometer-alt',
        커뮤니케이터: 'fa-comments',
        중재가: 'fa-handshake',
        프로세서: 'fa-cogs',
        애널리스트: 'fa-chart-line',
        디테일리스트: 'fa-list-alt',
        '컨트롤 타워': 'fa-project-diagram',
    };

    const groups = typeData.types.map((type, index) => ({
        title: type.disc_character,
        description: type.description,
        types: [
            {
                title: type.disc_character,
                description: type.description,
                strengths: Array.isArray(type.strength) ? type.strength.join(' ') : '',
                weaknesses: Array.isArray(type.weakness) ? type.weakness.join(' ') : '',
                bestMatch: type.suitable_type?.[0]?.name ?? '',
                bestMatchDescription: type.suitable_type?.[0]?.description ?? '',
                complement: type.suitable_type?.[1]?.name ?? '',
                complementDescription: type.suitable_type?.[1]?.description ?? '',
                color: type.color,
                ref: refs.current[index],
                disc_img: type.disc_img,
            },
        ],
    }));
    return (
        <div className="relative flex flex-col items-center w-full overflow-y-auto mb-0">
            <main className="flex flex-col items-center w-full pt-16">
                <div className="carousel w-[80%] h-[40%] md:w-[90%]">
                    <Carousel
                        showArrows={true}
                        showThumbs={false}
                        infiniteLoop={true}
                        autoPlay={true}
                        interval={1800}
                        showStatus={false}
                    >
                        <div>
                            <img src="/images/mainImage1.png" alt="Sample 1" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <img src="/images/mainImage2.png" alt="Sample 2" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <img src="/images/mainImage3.png" alt="Sample 3" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <img src="/images/mainImage4.png" alt="Sample 4" className="w-full h-full object-cover" />
                        </div>
                    </Carousel>
                </div>
                <div className="w-[80%] mt-10 border border-gray-300 rounded-lg p-4">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <i className="w3-jumbo w3-text-blue">&#128226;</i>
                        <span className="ml-2">공지사항</span>
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4">
                            <div className="text-gray-800 font-bold text-lg">v. 0.2 배포완료</div>
                            <div className="text-gray-600">2024-09-01</div>
                            <hr className="my-4" />
                            <div className="text-black mb-10">
                                안녕하세요, WORKLOG 운영팀입니다. <br />
                                <br />
                                타인에게 받는 내 업무 유형 테스트, WORKLOG가 새로 업데이트를 마쳤습니다. 서버 안정성을
                                더 확보하고, 한줄소개 추가, 피드백 레포트 구체화 등이 추가적으로 반영되었습니다. <br />
                                일하는 모두를 위한 더 나은 서비스가 되도록 하겠습니다. <br />
                                <br /> 많은 관심과 응원 부탁드립니다.
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="mt-12 mb-8 px-4 py-6 w-[100%] md:w-[80%] rounded-lg">
                <div className="text-3xl text-black leading-relaxed ">
                    <div
                        className="text-[#4053ff] text-3xl font-extrabold mb-4 inline-block pb-6 border-b border-gray-300"
                        style={{ marginBottom: '16px' }}
                    >
                        .WORKLOG
                        <span className="text-gray-400"> : 팀원에게 나는 어떤 업무 스타일의 사람일까? </span>
                    </div>
                    <br />
                    <span className="text-xl text-black leading-relaxed">
                        나는 일할 때 어떤 사람일까요? 함께 일했던 사람들의 피드백을 모아, 본인의 업무 페르소나를
                        파악하고 싶은 당신께 워크로그가 찾아 왔습니다! <br />
                        WORKLOG는 업무 유형 알아보기 테스트 서비스로, 협업으로 일하는 모두를 위한 일종의 자기이해
                        서비스예요.
                        <br />
                        세분화 된 설문지 문항과 AI를 활용해 타인이 평가하는 '협업 활동에서의 나' 를 체계적으로
                        분석하면서, 본인의 실제로 팀 내의 모습을 객관적인 시선에서 이해할 수 있도록 도와줍니다.
                    </span>
                </div>
            </div>
            {/* Type icons */}
            <div className="text-2xl font-bold m-8">.WORKLOG의 8가지 유형 둘러보기</div>
            <div className="flex justify-center mt-4 w-[80%] rounded-lg">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 w-full">
                    {typeData.types.map(
                        (type, index) =>
                            type.disc_character !== 'None' && (
                                <div
                                    key={index}
                                    className="text-center mx-2 my-1 group"
                                    onClick={() => scrollToSection(index)}
                                >
                                    <i
                                        className={`fas ${
                                            iconMapping[type.disc_character]
                                        } fa-2x w-12 h-12 mx-auto text-gray-400 group-hover:text-[#4053FF] group-hover:cursor-pointer`}
                                    ></i>
                                    <div className="text-gray-800 text-lg font-bold group-hover:text-[#4053FF] group-hover:cursor-pointer">
                                        {type.disc_character}
                                    </div>
                                </div>
                            )
                    )}
                </div>
            </div>

            {/* Group details */}
            {groups.map((group, groupIndex) => (
                <div
                    key={groupIndex}
                    className="mt-8 item-center scroll-mt-12 w-[80%] flex flex-col justify-center items-center"
                >
                    {group.types.map(
                        (type, typeIndex) =>
                            type.title !== 'None' && (
                                <div key={typeIndex} className="mt-10" ref={type.ref}>
                                    <div className="flex flex-col flex-wrap mt-5 justify-center items-center">
                                        <div
                                            className="text-xl w-60 h-16 mb-10 rounded-lg px-5 py-2 text-center flex items-center justify-center text-white font-bold"
                                            style={{ backgroundColor: type.color }}
                                        >
                                            {type.title}
                                        </div>
                                        <img
                                            src={type.disc_img}
                                            alt={type.title}
                                            className="w-44 h-44 mb-10 items-center"
                                        />

                                        <div className="w-full lg:w-3/4 text-black text-xl leading-relaxed"></div>
                                    </div>
                                </div>
                            )
                    )}
                    <p className="text-xl text-center w-[45%] mt-5 text-black mb-8">{group.description}</p>
                </div>
            ))}
        </div>
    );
}

export default Main;
