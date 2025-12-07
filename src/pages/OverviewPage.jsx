import React, { useState, useEffect, useMemo } from "react";
import { userStore } from "../store/userStore";
import MinePlannerPage from "./MinePlannerPage";
import ShippingPlannerPage from "./ShippingPlannerPage";

function OverviewPage() {
  const user = userStore((state) => state.user);

  const defaultView = useMemo(() => {
    if (user?.role === "mine_planner") return "mine";
    if (user?.role === "shipping_planner") return "shipping";
    return "mine";
  }, [user]);

  const [activeView, setActiveView] = useState(defaultView);

  useEffect(() => {
    setActiveView(defaultView);
  }, [defaultView]);

  return (
    <main className="min-h-screen bg-[#f5f5f7] flex justify-center">
      <div className="w-full max-w-[1440px] py-10 px-10 flex flex-col gap-8">

        {/* Title */}
        <header>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">
            Overview
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Ringkasan overview tambang atau pelabuhan berdasarkan filter global.
          </p>
        </header>

        {/* Tabs */}
        <nav
          aria-label="Overview content tabs"
          className="bg-[#e7ecf5] rounded-full p-1 flex gap-1 w-fit"
        >
          <button
            type="button"
            onClick={() => setActiveView("mine")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              activeView === "mine"
                ? "bg-[#1c2534] text-white"
                : "text-[#1c2534]"
            }`}
          >
            Mine Planner View
          </button>

          <button
            type="button"
            onClick={() => setActiveView("shipping")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              activeView === "shipping"
                ? "bg-[#1c2534] text-white"
                : "text-[#1c2534]"
            }`}
          >
            Shipping Planner View
          </button>
        </nav>

        {/* Content */}
        <section aria-label="Overview content">
          {activeView === "mine" ? <MinePlannerPage /> : <ShippingPlannerPage />}
        </section>

      </div>
    </main>
  );
}

export default OverviewPage;
