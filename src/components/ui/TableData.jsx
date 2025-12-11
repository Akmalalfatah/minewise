import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableData({ data = [] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px] font-semibold">Segmen</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Speed</TableHead>
          <TableHead>Friction</TableHead>
          <TableHead>Water</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((item, index) => (
          <TableRow key={item.road || index}>
            <TableCell className="font-semibold">{item.road}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>{item.speed} km/h</TableCell>
            <TableCell>{item.friction}</TableCell>
            <TableCell>{item.water} cm</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TableData;
