import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const chartConfig = {
  production: {
    label: "Production",
    color: "#FF7B54",
  },
  target: {
    label: "Target",
    color: "#8E929A",
  },
};

export function ChartAreaGradient({ data = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data produksi dan target dengan intensitas hujan</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              top: 10,
              left: 20,
              right: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid
              stroke="#D1D5DB"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "#8E929A", fontSize: 11 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "#8E929A", fontSize: 11 }}
            />

            <ChartTooltip
              cursor={{ stroke: "#FF7B54", strokeOpacity: 0.2 }}
              content={<ChartTooltipContent />}
            />

            <defs>
              <linearGradient id="fillProduction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF7B54" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#FF7B54" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <Area
              type="natural"
              dataKey="production"
              fill="url(#fillProduction)"
              stroke="#FF7B54"
              strokeWidth={2}
              name="Production"
            />

            <Line
              type="natural"
              dataKey="target"
              stroke="#8E929A"
              strokeWidth={2}
              dot={false}
              name="Target"
            />

            <ChartLegend
              verticalAlign="bottom"
              content={<ChartLegendContent />}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ChartAreaGradient;
