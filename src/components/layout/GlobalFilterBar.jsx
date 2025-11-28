function GlobalFilterBar() {
    return (
        <div data-layer="global_filter_bar" className="GlobalFilterBar w-[592px] h-[71px] px-[17px] py-3.5 bg-white rounded-[50px] inline-flex flex-col justify-center items-center gap-2.5">
            <div data-layer="filter_bar_container" className="FilterBarContainer size- inline-flex justify-start items-center gap-[18px]">
                <div data-layer="filter_button_container" className="FilterButtonContainer size- flex justify-start items-center gap-3">
                    <div data-layer="icon_wrapper" className="IconWrapper size-[57px] bg-[#1c2534] rounded-[50px] flex justify-center items-center gap-2.5">
                        <img data-layer="icon_filter_filter" className="IconFilterFilter size-[31px]" src="/icons/icon_filter_filter.png" />
                    </div>
                    <div data-layer="icon_expand_left" className="IconExpandLeft w-1.5 h-3 border-2 border-black" />
                </div>
                <div data-layer="filter_groups_container" className="FilterGroupsContainer size- flex justify-start items-center gap-3">
                    <div data-layer="filter_item_location" className="FilterItemLocation w-[138px] bg-[#efefef] rounded-3xl flex justify-start items-center gap-2">
                        <div data-layer="filter_icon_wrapper" className="FilterIconWrapper size-11 bg-[#1c2534] rounded-[50px] flex justify-center items-center gap-2.5">
                            <img data-layer="icon_location" className="IconLocation size-[27px]" src="/icons/icon_location.png" />
                        </div>
                        <div data-layer="filter_label_location" className="FilterLabelLocation size- flex justify-start items-center gap-3">
                            <div data-layer="filter_location_title" className="FilterLocationTitle justify-start text-black text-base font-normal">PIT A</div>
                            <div data-layer="icon_expand_right" className="IconExpandRight w-1.5 h-3 origin-top-left rotate-180 border-2 border-black" />
                        </div>
                    </div>
                    <div data-layer="filter_item_time" className="FilterItemTime w-[148px] bg-[#efefef] rounded-3xl flex justify-start items-center gap-2">
                        <div data-layer="filter_icon_wrapper" className="FilterIconWrapper size-11 bg-[#1c2534] rounded-[50px] flex justify-center items-center gap-2.5">
                            <img data-layer="icon_clock" className="IconClock size-[31px]" src="/icons/icon_clock.png" />
                        </div>
                        <div data-layer="filter_label_time" className="FilterLabelTime size- flex justify-start items-center gap-3">
                            <div data-layer="filter_time_title" className="FilterTimeTitle justify-start text-black text-base font-normal">Weekly</div>
                            <div data-layer="icon_expand_right" className="IconExpandRight w-1.5 h-3 origin-top-left rotate-180 border-2 border-black" />
                        </div>
                    </div>
                    <div data-layer="filter_item_shift" className="FilterItemShift w-[140px] bg-[#efefef] rounded-3xl flex justify-start items-center gap-2">
                        <div data-layer="filter_icon_wrapper" className="FilterIconWrapper size-11 bg-[#1c2534] rounded-[50px] flex justify-center items-center gap-2.5">
                            <img data-layer="icon_shift" className="IconShift size-[27px]" src="/icons/icon_shift.png" />
                        </div>
                        <div data-layer="filter_label_shift" className="FilterLabelShift size- flex justify-start items-center gap-3">
                            <div data-layer="filter_shift_title" className="FilterShiftTitle justify-start text-black text-base font-normal">Shift 1</div>
                            <div data-layer="icon_expand_right" className="IconExpandRight w-1.5 h-3 origin-top-left rotate-180 border-2 border-black" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GlobalFilterBar;