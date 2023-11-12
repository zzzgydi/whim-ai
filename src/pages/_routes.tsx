import {
  RxCodesandboxLogo,
  RxComponent1,
  RxDashboard,
  RxGear,
  RxHome,
} from "react-icons/rx";
import { HomePage } from "./home";
import { SettingPage } from "./settings";
import { AssistantPage } from "./assistant";
import { PlaygroundPage } from "./playground";
import { ThreadPage } from "./thread";

export const routes = [
  {
    path: "/",
    icon: <RxHome />,
    label: "Home",
    component: HomePage,
  },
  {
    path: "/playground",
    icon: <RxDashboard />,
    label: "Playground",
    component: PlaygroundPage,
  },
  {
    path: "/assistant",
    icon: <RxComponent1 />,
    label: "Assistant",
    component: AssistantPage,
  },
  {
    path: "/thread",
    icon: <RxCodesandboxLogo />,
    label: "Thread",
    component: ThreadPage,
  },
  {
    path: "/setting",
    icon: <RxGear />,
    label: "Setting",
    component: SettingPage,
  },
];
