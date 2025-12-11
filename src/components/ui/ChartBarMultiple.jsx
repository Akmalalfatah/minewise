import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const COLOR_PRIMARY = "#FF7B54";
const COLOR_SECONDARY = "#6A7D9B";
const COLOR_TERTIARY = "#1C2534";
const COLOR_OTHER = "#1C2534";

const chartConfig = {
  active: { label: "Active", color: COLOR_PRIMARY },
  standby: { label: "Standby", color: COLOR_SECONDARY },
  under_repair: { label: "Under Repair", color: COLOR_TERTIARY },
  maintenance: { label: "Maintenance", color: COLOR_OTHER },
};

export function ChartBarMultiple({ data = [] }) {
  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
          >
            <CartesianGrid stroke="#D1D5DB" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: "#8E929A", fontSize: 11 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: "#8E929A", fontSize: 11 }}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />

            <Bar dataKey="active" fill={COLOR_PRIMARY} radius={4} />
            <Bar dataKey="standby" fill={COLOR_SECONDARY} radius={4} />
            <Bar dataKey="under_repair" fill={COLOR_TERTIARY} radius={4} />
            <Bar dataKey="maintenance" fill={COLOR_OTHER} stroke="#1C2534" strokeWidth={1} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ChartBarMultiple;
