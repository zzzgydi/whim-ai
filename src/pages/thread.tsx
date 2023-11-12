import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useWhimStore } from "@/lib/state";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export const ThreadPage = () => {
  const [search] = useSearchParams();

  const threadId = search.get("thread");

  const { data, mutate } = useSWR(
    threadId ? `/listMessages/${threadId}` : null,
    async () => {
      return useWhimStore
        .getState()
        .openai?.beta.threads.messages.list(threadId!);
    }
  );

  const messages = useMemo(() => {
    const ret = data?.data?.slice() ?? [];
    ret.reverse();
    return ret;
  }, [data]);

  console.log(messages);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-none h-14 border-b flex items-center px-5 font-semibold justify-between">
        <h1>Thread</h1>
      </div>

      <div className="flex-auto flex flex-col overflow-hidden">
        <div className="flex-auto overflow-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="w-[80%] mx-auto px-2 py-2 my-2">
              <div className="capitalize text-base font-semibold">
                {msg.role}
              </div>
              <div>
                {msg.content?.map((c, i) => (
                  <div key={`${msg.id}-${i}`}>
                    {c.type === "text" && c.text.value}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-none p-5">
          <div className="flex justify-end items-center gap-2 mb-2">
            <Button size="sm">Add and Run</Button>
            <Button size="sm">Add</Button>
          </div>

          <Textarea
            className="resize-none"
            placeholder="Enter your message here..."
          />
        </div>
      </div>
    </div>
  );
};
