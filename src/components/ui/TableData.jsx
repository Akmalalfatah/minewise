import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const roadSegments = [
  {
    segment: "Road A",
    status: "Licin",
    speed: "12 km/h",
    friction: "0.35",
    water: "5 cm",
  },
  {
    segment: "Road B",
    status: "Normal",
    speed: "25 km/h",
    friction: "0.65",
    water: "0 cm",
  },
  {
    segment: "Road C",
    status: "Banjir",
    speed: "8 km/h",
    friction: "0.21",
    water: "17 cm",
  },
];

export function RoadSegmentTable() {
  return (
    <Table>
      <TableCaption>Road Condition by Segment</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Segmen</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Speed</TableHead>
          <TableHead>Friction</TableHead>
          <TableHead>Water</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {roadSegments.map((item) => (
          <TableRow key={item.segment}>
            <TableCell className="font-medium">{item.segment}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>{item.speed}</TableCell>
            <TableCell>{item.friction}</TableCell>
            <TableCell className="font-semibold">{item.water}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
