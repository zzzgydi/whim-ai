import React from "react";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeHighlight from "rehype-highlight";
import { useRef, useState, RefObject, useEffect } from "react";
import { useDebounceFn, useThrottleFn } from "ahooks";
import { MdContentCopy } from "react-icons/md";
import "katex/dist/katex.min.css";

const MarkdownInner = (props: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[
        RehypeKatex,
        [RehypeHighlight, { detect: false, ignoreMissing: true }],
      ]}
      components={{
        pre: PreCode,
        a: (aProps) => {
          const href = aProps.href || "";
          const isInternal = /^\/#/i.test(href);
          const target = isInternal ? "_self" : aProps.target ?? "_blank";
          return <a {...aProps} target={target} />;
        },
      }}
    >
      {props.content}
    </ReactMarkdown>
  );
};

export const MarkdownContent = React.memo(MarkdownInner);

export function Mermaid(props: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (props.code && ref.current) {
      mermaid
        .run({
          nodes: [ref.current],
          suppressErrors: true,
        })
        .catch((e) => {
          setHasError(true);
          console.error("[Mermaid] ", e.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.code]);

  function viewSvgInNewWindow() {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    const text = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([text], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url);
    if (win) {
      win.onload = () => URL.revokeObjectURL(url);
    }
  }

  if (hasError) {
    return null;
  }

  return (
    <div
      className="no-dark mermaid"
      style={{
        cursor: "pointer",
        overflow: "auto",
      }}
      ref={ref}
      onClick={() => viewSvgInNewWindow()}
    >
      {props.code}
    </div>
  );
}
export function PreCode(props: { children: any }) {
  const ref = useRef<HTMLPreElement>(null);
  const refText = ref.current?.innerText;
  const [mermaidCode, setMermaidCode] = useState("");

  const toast = useToast({ position: "top" });

  const { run: renderMermaid } = useDebounceFn(
    () => {
      if (!ref.current) return;
      const mermaidDom = ref.current.querySelector("code.language-mermaid");
      if (mermaidDom) {
        setMermaidCode((mermaidDom as HTMLElement).innerText);
      }
    },
    { wait: 600 }
  );

  useEffect(() => {
    setTimeout(renderMermaid, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refText]);

  return (
    <>
      {mermaidCode.length > 0 && (
        <Mermaid code={mermaidCode} key={mermaidCode} />
      )}
      <pre ref={ref} className="relative">
        <div className="absolute top-1 right-1">
          <IconButton
            size="sm"
            aria-label="Copy"
            icon={<MdContentCopy />}
            color="whiteAlpha.900"
            _hover={{ bg: "whiteAlpha.200" }}
            variant="ghost"
            onClick={async () => {
              if (!ref.current) return;
              const code = ref.current.innerText;
              try {
                await navigator.clipboard.writeText(code);
                toast({
                  status: "success",
                  title: "Copied to clipboard!",
                });
              } catch {
                toast({
                  status: "error",
                  title: "Failed to copy to clipboard!",
                });
              }
            }}
          />
        </div>

        {props.children}
      </pre>
    </>
  );
}

type Props = {
  content: string;
  loading?: boolean;
  fontSize?: number;
  parentRef?: RefObject<HTMLDivElement>;
  defaultShow?: boolean;
} & React.DOMAttributes<HTMLDivElement>;

export const Markdown = (props: Props) => {
  const mdRef = useRef<HTMLDivElement>(null);
  const renderedHeight = useRef(0);
  const renderedWidth = useRef(0);
  const inView = useRef(!!props.defaultShow);
  const [_, triggerRender] = useState(0);

  const { run: checkInView } = useThrottleFn(
    () => {
      const parent = props.parentRef?.current;
      const md = mdRef.current;
      if (parent && md && !props.defaultShow) {
        const parentBounds = parent.getBoundingClientRect();
        const twoScreenHeight = Math.max(500, parentBounds.height * 2);
        const mdBounds = md.getBoundingClientRect();
        const parentTop = parentBounds.top - twoScreenHeight;
        const parentBottom = parentBounds.bottom + twoScreenHeight;
        const isOverlap =
          Math.max(parentTop, mdBounds.top) <=
          Math.min(parentBottom, mdBounds.bottom);
        inView.current = isOverlap;
        triggerRender(Date.now());
      }

      if (inView.current && md) {
        const rect = md.getBoundingClientRect();
        renderedHeight.current = Math.max(renderedHeight.current, rect.height);
        renderedWidth.current = Math.max(renderedWidth.current, rect.width);
      }
    },
    { wait: 300, leading: true, trailing: true }
  );

  useEffect(() => {
    props.parentRef?.current?.addEventListener("scroll", checkInView);
    checkInView();
    return () => {
      props.parentRef?.current?.removeEventListener("scroll", checkInView);
    };
  }, []);

  const getSize = (x: number) => (!inView.current && x > 0 ? x : "auto");

  return (
    <div
      className="markdown-body"
      style={{
        fontSize: `${props.fontSize ?? 14}px`,
        height: getSize(renderedHeight.current),
        width: getSize(renderedWidth.current),
        direction: /[\u0600-\u06FF]/.test(props.content) ? "rtl" : "ltr",
      }}
      ref={mdRef}
      onContextMenu={props.onContextMenu}
      onDoubleClickCapture={props.onDoubleClickCapture}
    >
      {inView.current &&
        (props.loading ? (
          <Spinner size="sm" color="secondaryText" />
        ) : (
          <MarkdownContent content={props.content} />
        ))}
    </div>
  );
};
