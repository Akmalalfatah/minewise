import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

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
} from "@/components/ui/chart";

const COLOR_PRIMARY = "#FF7B54";

const chartConfig = {
  value: { label: "Value", color: COLOR_PRIMARY },
};

export function ChartTooltipDefault({ data = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Grafik Perbandingan Nilai
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 12, right: 20, left: 10, bottom: 12 }}
          >
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "#6A7D9B", fontSize: 11 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "#6A7D9B", fontSize: 11 }}
            />

            <ChartTooltip
              cursor={{ fill: "rgba(255, 123, 84, 0.15)" }}
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value}`}
                  labelFormatter={(label) => label}
                />
              }
            />

            <Bar
              dataKey="value"
              fill={COLOR_PRIMARY}
              radius={[4, 4, 4, 4]}
              barSize={32}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ChartTooltipDefault;
