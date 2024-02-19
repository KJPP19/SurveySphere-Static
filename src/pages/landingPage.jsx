import NavBar from "../components/navbar/navbar";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import workspaceimg from "../assets/workspaceimg.png";
import createsurveyimg from "../assets/createsurveyimg.png";
import resultimg from "../assets/resultimg.png";

function LandingPage () {
    
    const { deauthenticateUser, isAuthenticated, getUserFromLocalStorage } = useAuth();

    const featureData = [
        {
            title: "Effortless Survey Creation",
            description: "Create surveys with ease using our user-friendly interface. No steep learning curves, just a straightforward design process.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 rounded-md">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>,
        },
        {
            title: "Organized Workspace",
            description: "Stay organized with dedicated workspaces for your surveys. Create, edit, and manage multiple surveys effortlessly within your personalized workspace.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
            </svg>
          
        },
        {
            title: "Shareable Survey Links",
            description: "Generate unique shareable links for each survey, making it easy to distribute and collect responses. Share your surveys via email, social media, or embed them on your website.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          
        },
        {
            title: "Instant Result Page",
            description: "Access insights with a dedicated results page for each survey. Effortlessly view and analyze responses as they come in.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          
        },
        {
            title: "Secure and Private",
            description: "Rest easy with robust security measures, including user authentication. Your surveys and responses are secure, ensuring the privacy of both creators and respondents.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
          
        },
    ];

    return (
        <div className="flex flex-col h-screen w-screen font-raleway">
            <NavBar isAuthenticated={isAuthenticated} onLogout={deauthenticateUser} userInfo={getUserFromLocalStorage()}/>
            <div className="h-full w-full overflow-y-auto">
                <div className="flex w-full h-full items-center justify-between px-10 md:px-20 lg:px-32">
                    <div className="w-full space-y-4">
                        <div className="tracking-wider text-4xl md:text-6xl">Simplify your Survey With <span className="font-semibold tracking-normal">SurveySphere</span></div>
                        <div className="w-full tracking-normal text-justify text-gray-500 text-xl">Create surveys online effortlessly with SurveySphere. Simplified survey creation, distribution, and analysis in one place. Uncover valuable insights with ease.</div>
                        <div>
                            <Link to="/signup" className="bg-[#000000] py-2 px-3 rounded-md text-[#FFFFFF] font-semibold tracking-wider cursor-pointer hover:bg-[#3d3d3d]">Sign up now</Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center px-20">
                    <div className="text-4xl tracking-wider">Capabilities</div>
                    <div className="text-gray-600 text-lg">Explore the Capabilities of SurveySphere</div>
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-2 text-md">
                        {featureData.map((feature, index) => (
                            <div className="p-4 space-y-4 flex flex-col items-center" key={index}>
                                <div>{feature.icon}</div>
                                <div className="font-semibold tracking-wider text-lg">{feature.title}</div>
                                <div className="text-gray-600 text-justify tracking-tight">{feature.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-center mt-14">
                    <div className="text-4xl text-center">Clean, Organized and Easy to Understand</div>
                    <div className="flex flex-col md:flex-row items-center mt-12 w-full h-full space-x-0 md:space-x-12">
                        <div className="w-full md:w-1/2 text-xl md:pl-12">
                            <div className="w-fit p-2 rounded-md">{featureData[1].icon}</div>
                            <div className="text-justify tracking-tight">Efficiently manage your surveys with a clean, organized, and user-friendly workspace design.</div>
                        </div>
                        <div className="w-full md:w-3/4 mt-8 md:mt-0">
                            <img src={workspaceimg}/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-20">
                    <div className="text-4xl">Create Survey with Ease</div>
                    <div className="flex flex-col md:flex-row items-center mt-12 w-full h-full space-x-0 md:space-x-12">
                        <div className="w-full md:w-3/4 mt-8 md:mt-0">
                            <img src={createsurveyimg}/>
                        </div>
                        <div className="w-full md:w-1/2 text-xl md:pl-12">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-24 col-span-3 ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                                </svg>
                            </div>
                            <div className="text-justify tracking-tight">Effortlessly design surveys using our intuitive interface, simplifying the process from start to finish.</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-20">
                    <div className="text-4xl ">Key Findings and Insights</div>
                    <div className="flex flex-col md:flex-row items-center mt-12 w-full h-full space-x-0 md:space-x-12">
                        <div className="w-full md:w-1/2 text-xl md:pl-12">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                </svg>
                            </div>
                            <div className="text-justify tracking-wide">A concise overview highlighting the key findings and insights gathered from the responses</div>
                        </div>
                        <div className="w-full md:w-3/4 mt-8 md:mt-0">
                            <img src={resultimg}/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center justify-center mt-20 w-screen h-1/5 space-x-6">
                    <div>
                    <a  className="hover:opacity-65" href="https://www.linkedin.com/in/kean-jayther-ponio-1861a127b" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                        </svg>
                    </a>
                    </div>
                    <div>
                    <a className="hover:opacity-65" href="https://github.com/KJPP19/SurveySphere-Static" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage;