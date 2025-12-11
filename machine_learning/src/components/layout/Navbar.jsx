function Navbar() {
    return (
        <div data-layer="globall_navbar" className="GloballNavbar w-[944px] px-8 py-6 bg-white rounded-[50px] inline-flex flex-col justify-center items-center gap-3">
            <div data-layer="navbar_container" className="NavbarContainer self-stretch inline-flex justify-between items-center">
                <div data-layer="navbar_logo" className="NavbarLogo justify-start text-[#ff7b54] text-2xl font-semibold">MineWise</div>
                <div data-layer="navbar_menu_list" className="NavbarMenuList w-[683px] flex justify-center items-center gap-[58px]">
                    <div data-layer="navbar_menu_dashboard" className="NavbarMenuDashboard justify-start text-[#666666] text-base font-normal">Dashboard</div>
                    <div data-layer="navbar_menu_simulation_analysis" className="NavbarMenuSimulationAnalysis justify-start text-[#666666] text-base font-normal">Simulation Analysis</div>
                    <div data-layer="navbar_menu_ai_chatbox" className="NavbarMenuAiChatbox justify-start text-[#666666] text-base font-normal">AI Chatbox</div>
                    <div data-layer="navbar_menu_overview" className="NavbarMenuOverview justify-start text-[#666666] text-base font-normal">Overview</div>
                    <div data-layer="navbar_menu_reports" className="NavbarMenuReports justify-start text-[#666666] text-base font-normal">Reports</div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;