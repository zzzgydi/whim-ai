import * as z from "zod";
import OpenAI from "openai";
import { mutate } from "swr";
import { useWhimStore } from "@/lib/state";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  apiKey: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export const SettingPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { apiKey: useWhimStore.getState().apiKey },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.apiKey) {
      window.alert("Please enter your API Key");
      return;
    }

    const openai = new OpenAI({
      apiKey: values.apiKey,
      dangerouslyAllowBrowser: true,
    });

    useWhimStore.setState({ apiKey: values.apiKey, openai });

    // clear all cache
    mutate(() => true, undefined, { revalidate: false });

    try {
      localStorage.setItem("whim-state", values.apiKey);
    } catch {}

    window.alert("Saved!");
  }

  return (
    <div>
      <div className="h-14 border-b flex items-center px-5 font-semibold">
        <h1>Setting</h1>
      </div>

      <div className="my-6 mx-8 max-w-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="sk-xxx" type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
