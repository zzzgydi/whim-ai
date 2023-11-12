import useSWR from "swr";
import * as z from "zod";
import { useWhimStore } from "@/lib/state";
import { RxCaretSort } from "react-icons/rx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OpenAI from "openai";

export const PlaygroundPage = () => {
  const { data: assistants } = useSWR("listAssistant", async () => {
    const resp = await useWhimStore.getState().openai?.beta.assistants.list();
    return resp?.data;
  });

  const [assistant, setAssistant] = useState<OpenAI.Beta.Assistant | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!assistant && assistants?.length) {
      setAssistant(assistants[0]);
    }
  }, [assistant, assistants]);

  useEffect(() => {
    if (!assistant) return;

    form.setValue("name", assistant.name!);
    form.setValue("instructions", assistant.instructions!);
    form.setValue("model", assistant.model!);
  }, [assistant]);

  function onSubmit(values: z.infer<typeof formSchema>) {}

  const modelList = [
    "gpt-4-1106-preview",
    "gpt-4",
    "gpt-3.5-turbo-16k",
    "gpt-3.5-turbo-1106",
    "gpt-3.5-turbo",
  ];

  return (
    <div className="h-full flex flex-col ">
      <div className="flex-none h-14 border-b flex items-center px-5 font-semibold justify-between">
        <h1>Playground</h1>
      </div>

      <div className="flex-auto flex overflow-hidden">
        <div className="flex-none flex flex-col w-[320px] border-r">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="w-full"
              onChange={(e) => {
                console.log(e);
              }}
            >
              <div className="h-[56px] border-b truncate flex items-center px-5 justify-between cursor-pointer hover:bg-gray-200">
                <span>{assistant?.name || "No Selected"}</span>
                <RxCaretSort />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[280px]">
              <DropdownMenuLabel>+ Create New Assistant</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={assistant?.id}
                onValueChange={(e) =>
                  setAssistant(assistants?.find((i) => i.id === e) ?? null)
                }
              >
                {assistants?.map((item) => (
                  <DropdownMenuRadioItem
                    key={item.id}
                    value={item.id}
                    className="truncate"
                  >
                    {item.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="px-5 py-4 flex-auto overflow-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a user friendly name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {assistant?.id ?? "nothing"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="You are a helpful assistant."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {modelList.map((m) => (
                            <SelectItem value={m} key={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <Button type="submit">Save</Button>
              </form>
            </Form>
          </div>
        </div>

        <div className="w-full h-full"></div>
      </div>
    </div>
  );
};

const formSchema = z.object({
  name: z.ostring(),
  instructions: z.ostring(),
  model: z.ostring(),
});
