"use client";
import { title, subtitle } from "@/components/primitives";

interface BlockProps {
  BlockTitle: string;
  BlockText?: null | string;
}

export default function Block({ BlockTitle, BlockText = null}: BlockProps) {
  return (
    <section className="flex flex-col justify-center gap-4 py-8 md:py-2">
      <div className="inline-block max-w-xl justify-center">
        <h1 className={title({ size: "sm" })}>
            {BlockTitle}
            </h1>
      </div>
      <div className="inline-block max-w-8xl justify-center">
        <div className={subtitle({ class: "mt-4" })}>
          {BlockText}
        </div>
      </div>

    </section>
  );
};
