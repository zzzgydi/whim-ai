import useSWR from "swr";
import * as z from "zod";
import { useWhimStore } from "@/lib/state";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export const AssistantPage = () => {
  const { data } = useSWR("listAssistant", async () => {
    const resp = await useWhimStore.getState().openai?.beta.assistants.list();
    return resp?.data;
  });

  return (
    <div>
      <div className="h-14 border-b flex items-center px-5 font-semibold justify-between">
        <h1>Assistant</h1>

        <Button size="sm">Create</Button>
      </div>

      <div className="my-5 mx-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Instructions</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="w-[200px] font-medium">
                  {item.name}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {item.instructions}
                </TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
