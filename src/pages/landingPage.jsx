import NavBar from "../components/navbar/navbar";
import useAuth from "../hooks/useAuth";

function LandingPage () {
    
    const { deauthenticateUser, isAuthenticated, getUserFromLocalStorage } = useAuth();

    const featureData = [
        {
            title: "Effortless Survey Creation",
            description: "Create surveys with ease using our user-friendly interface. No steep learning curves, just a straightforward design process.",
        },
        {
            title: "Organized Workspace",
            description: "Stay organized with dedicated workspaces for your surveys. Create, edit, and manage multiple surveys effortlessly within your personalized workspace.",
        },
        {
            title: "Shareable Survey Links",
            description: "Generate unique shareable links for each survey, making it easy to distribute and collect responses. Share your surveys via email, social media, or embed them on your website.",
        },
        {
            title: "Instant Result Page",
            description: "Access real-time insights with a dedicated results page for each survey. Effortlessly view and analyze responses as they come in.",
        },
        {
            title: "Response Table",
            description: "Dive into the details with a comprehensive response table. Easily navigate through individual responses, track trends, and gain a deeper understanding of your data.",
        },
        {
            title: "Secure and Private",
            description: "Rest easy with our robust security measures, including user authentication. Your surveys and responses are secure, ensuring the privacy of both creators and respondents.",
        },
    ];

    return (
        <div className="flex flex-col h-screen">
            <NavBar isAuthenticated={isAuthenticated} onLogout={deauthenticateUser} userInfo={getUserFromLocalStorage()}/>
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center container mx-auto font-raleway space-y-6">
                    <div className="font-semibold text-4xl sm:text-6xl md:text-6xl">Simplify your Survey With SurveySphere</div>
                    <div className="text-1xl sm:text-2xl md:text-2xl px-16">Create surveys online effortlessly with SurveySphere. Simplified survey creation, distribution, and analysis in one place. Uncover valuable insights with ease.</div>
                    <div className="text-xl font-semibold">Key features:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-5 text-md px-16">
                        {featureData.map((feature, index) => (
                            <div key={index} className=" shadow-lg rounded-lg p-3">
                                <div className="font-semibold">{feature.title}</div>
                                <div className="text-[#3d3d3d]">{feature.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage;