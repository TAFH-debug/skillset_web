"use client";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { title } from "@/components/primitives";
import { Form } from "@heroui/form";
import { FormEvent } from "react";

export default function Home() {

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const response = await fetch("/api/s3/upload", {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    console.log(data);
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>
          Next.JS + HeroUI + DrizzleORM + Neon template
        </span>
      </div>

      <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          <span>Upload a file</span>
          <input type="file" name="file" />
        </label>
        <button type="submit">Submit</button>
      </Form>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div>
    </section>
  );
}
