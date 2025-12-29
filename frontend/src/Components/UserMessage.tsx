import React from "react";
import type { Message } from "../Types";
interface UserInputProps {
  message: Message;
}

export const UserInput: React.FC<UserInputProps> = ({ message }) => {
  const { text } = message;
  return (
    <div className="w-full">
      {/*<div className="max-w-xs sm:max-w-md px-4 py-2  rounded-lg bg-slate-400 text-white">*/}
      <div className="max-w-3xl mx-auto text leading-relaxed whitespace-pre-wrap flex justify-end">
        <p className="rounded-2xl bg-slate-400 text-white px-3 py-2">{text}</p>
      </div>
    </div>
  );
};
