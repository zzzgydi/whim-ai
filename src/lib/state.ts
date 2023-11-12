import OpenAI from "openai";
import { create } from "zustand";

export const useWhimStore = create(() => ({
  apiKey: "",
  openai: null as OpenAI | null,
}));

(function () {
  try {
    const apiKey = localStorage.getItem("whim-state");
    if (apiKey) {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      useWhimStore.setState({ apiKey, openai });
    }
  } catch {}
})();

const THREAD_KEY = "thread-state";

export const threadController = {
  listThreads: async () => {
    const data = localStorage.getItem(THREAD_KEY);
    if (data) {
      return JSON.parse(data) as OpenAI.Beta.Thread[];
    }
    return [];
  },
  saveThread: async (thread: OpenAI.Beta.Thread) => {
    const threads = await threadController.listThreads();
    const existingThread = threads.find((t) => t.id === thread.id);
    if (!existingThread) {
      threads.push(thread);
    }
    localStorage.setItem(THREAD_KEY, JSON.stringify(threads));
  },
  deleteThread: async (thread: OpenAI.Beta.Thread) => {
    const threads = await threadController.listThreads();
    const existingThread = threads.find((t) => t.id === thread.id);
    if (existingThread) {
      const index = threads.indexOf(existingThread);
      threads.splice(index, 1);
    }
    localStorage.setItem(THREAD_KEY, JSON.stringify(threads));
  },
};
