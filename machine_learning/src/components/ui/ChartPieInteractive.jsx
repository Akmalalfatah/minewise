import * as React from "react";
import { Label, Pie, PieChart, Sector, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLOR_PRIMARY = "#FF7B54";
const COLOR_SECONDARY = "#6A7D9B";
const COLOR_TERTIARY = "#1C2534";
const COLOR_OTHER = "#1C2534";

const chartConfig = {
  maintenance: { label: "Maintenance", color: COLOR_PRIMARY },
  weather: { label: "Weather", color: COLOR_SECONDARY },
  road_conditions: { label: "Road Conditions", color: COLOR_TERTIARY },
};

export function ChartPieInteractive({ data = [] }) {
  const id = "pie-interactive";
  const [activeIndex, setActiveIndex] = React.useState(0);

  const names = React.useMemo(() => data.map((item) => item.name), [data]);

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />

      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Downtime Causes</CardTitle>
        </div>

        <Select
          value={data[activeIndex]?.name}
          onValueChange={(val) =>
            setActiveIndex(data.findIndex((i) => i.name === val))
          }
        >
          <SelectTrigger className="ml-auto h-7 w-[150px] rounded-lg pl-2.5">
            <SelectValue placeholder="Select" />
          </SelectTrigger>

          <SelectContent align="end" className="rounded-xl">
            {names.map((key) => {
              const color =
                chartConfig[key.toLowerCase()]?.color || COLOR_OTHER;

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center text-xs gap-2">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{ backgroundColor: color }}
                    />
                    {key}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[220px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={90}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={(props) => {
                const outerRadius = props.outerRadius || 0;
                return (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 20}
                      innerRadius={outerRadius + 15}
                    />
                  </g>
                );
              }}
            >
              {data.map((entry, index) => {
                const key = entry.name.toLowerCase();
                const color = chartConfig[key]?.color || COLOR_OTHER;

                return <Cell key={index} fill={color} />;
              })}

              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan className="fill-foreground text-3xl font-bold">
                          {data[activeIndex].value}
                        </tspan>

                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Hours
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ChartPieInteractive;
