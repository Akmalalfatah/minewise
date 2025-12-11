import ChartBarMultiple from '../ui/ChartBarMultiple';

function DecisionImpactAnalysisCard({
    correlationResultInput
}) {
    return (
        <div data-layer="decision_impact_analysis_card" className="DecisionImpactAnalysisCard w-[729px] h-[316px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5">
            <div data-layer="card_container" className="CardContainer w-[681px] h-[260px] flex flex-col justify-start items-start gap-6">
                <div data-layer="header_left_group" className="HeaderLeftGroup w-[214px] inline-flex justify-start items-center gap-3">
                    <div data-layer="icon_wrapper" className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5">
                        <img data-layer="icon_decision" className="IconDecision size-[18px]" src="/icons/icon_decision.png" />
                    </div>
                    <div data-layer="decision_analysis_title" className="DecisionAnalysisTitle justify-start text-black text-sm font-semibold">Decision Impact Analysis</div>
                </div>
                <div data-layer="content_container" className="ContentContainer self-stretch inline-flex justify-start items-start gap-8">
                    <div data-layer="analysis_section" className="AnalysisSection w-[220px] h-[114px] inline-flex flex-col justify-start items-start gap-3">
                        <div data-layer="analysis_title" className="AnalysisTitle self-stretch justify-start text-black text-xs font-semibold">Data Curah Hujan vs Produksi</div>
                        <div data-layer="divider" className="Divider self-stretch flex-1 outline outline-[0.50px] outline-offset-[-0.25px] outline-black/25"></div>
                        <div data-layer="correlation_result_group" className="CorrelationResultGroup w-[89px] h-[66px] flex flex-col justify-start items-start gap-2">
                            <div data-layer="correlation_result_title" className="CorrelationResultTitle self-stretch justify-start text-[#666666] text-xs font-normal">Hasil korelasi</div>
                            <div data-layer="correlation_result_input" className="CorrelationResultInput self-stretch justify-start text-black text-4xl font-semibold">{correlationResultInput}</div>
                        </div>
                    </div>
                    <div data-layer="chart_section" className="ChartSection w-[429px] h-[225px] relative">
                        { /* Shadcn bar multiple */}
                        <div className='DecisionLineGraph w-[383px] h-[250px] left-[46px] top-[-54px] absolute'>
                            <ChartBarMultiple />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DecisionImpactAnalysisCard;