import ReactMarkdown from "react-markdown";

export type Message = {
  content: string;
  role: "user" | "bot";
};

type Props = {
  messages: Message[];
};

const ChatMessages = ({ messages }: Props) => {
  const onCopyMessage = (e: React.ClipboardEvent) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData("text/plain", selection);
    }
  };

  return (
    <div className="flex min-h-0 flex-col gap-3">
      {messages.map((message, index) => (
        <div
          key={index}
          onCopy={onCopyMessage}
          className={`max-w-md rounded-xl px-3 py-1 prose [&_p]:my-0 [&_ul]:my-1 [&_ol]:my-1 ${
            message.role === "user"
              ? "bg-blue-600 text-white self-end"
              : "bg-slate-700 !text-white prose-invert [&_*]:!text-white self-start"
          }`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
