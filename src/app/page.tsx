"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import Block from "@/components/block";
import { title } from "@/components/primitives";
import { Upload } from 'lucide-react';
import { Input } from "@heroui/input";
import { Progress } from "@heroui/progress";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

export default function Home() {
  const [clips, setClips] = useState<string[]>([]);
  const [progress, setProgress] = useState("");

  const handleSubmit = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    
    try {
      let file = event.target.files![0];

      setProgress("Uploading...");
  
      const formData = new FormData();
      formData.append("file", file); 
  
      const response = await axios.post("/api/s3/upload", formData);
      
      setProgress("Uploading to S3...");
      const link = response.data.downloadUrl;
  
      setProgress("Generating subtitles...");
      const subtitles = await axios.post("/api/negotiations/process", { audioUrl: link });
  
  
      setProgress("Generating highlights...");
  
      const highlights = await axios.post("/api/video/highlights", { file: subtitles.data.url, render: true });
  
      console.log(`Generated ${highlights.data.outputs.length} highlights`);
  
      setProgress("");
  
      setClips(highlights.data.outputs.map((highlight: any) => highlight.data[0].url));
    } catch (err) {
      addToast({
        title: "Error generating highlights",
        description: "Please try again",
        color: "danger",
      });
      console.log(err);
    }
  }

  return (
    <div className="relative flex flex-col items-center overflow-x-hidden ">
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-2xl text-center justify-center mb-8 ">
            <span className={title()}>
            Fast AI Video Editing
            </span>
        </div>

        {
          progress !== "" ? <div className="w-full my-2">
            <p className="text-md opacity-60">{progress}</p>
            <Progress isStriped isIndeterminate aria-label="Loading..." className="w-full" />
          </div> : <div className="flex flex-col gap-2 cursor-pointer">
            <Button color="primary" className="cursor-pointer">
              <label htmlFor="input" className="w-full h-full flex flex-row items-center gap-2 text-sm font-medium cursor-pointer">
                <Upload size={16} /> Upload a video
              </label>
            </Button>
            <Input
              id="input" 
              type="file"
              name="file" 
              className="hidden"
              color="primary"
              accept=".mp4, .mov, .webm"
              onChange={handleSubmit}
            />
          </div>
        }
        <p className="text-md opacity-60">Please choose a video with at least 2 minutes of content. It may take a while to generate the highlights...</p>
        {
          clips.length > 0 && (
            <div className="flex flex-wrap gap-4 max-w-full items-center justify-center">
              {clips.map((clip) => (
                <ReactPlayer controls={true} url={clip} key={clip} width={400} />
              ))}
            </div>
          )
        }
      </section>

      <section className="mt-20">
        <div id="scroll" className="flex flex-col md:flex-row gap-20 justify-center items-stretch max-w-screen mb-10">
        <div>
          <Block BlockTitle="Что делает нашу платформу уникальной?"/>
          <Accordion variant="shadow">
            <AccordionItem key="1" title="Пошаговая генерация"></AccordionItem>
            <AccordionItem key="2" title="Анализ видео"></AccordionItem>
            <AccordionItem key="3" title="Разрезка на клипы"></AccordionItem>
            <AccordionItem key="4" title="Автоматические субтитры"></AccordionItem>
          </Accordion>
        </div>
        <div>
          <Block BlockTitle="Как наша платформа улучшает навыки?"/>
          <Accordion variant="shadow" >
            <AccordionItem key="1" title="Регистрация">Создайте учетную запись и получите доступ к платформе.</AccordionItem>
            <AccordionItem key="2" title="Выбор видео">Выберите видео которое хотите использовать для клипов.</AccordionItem>
            <AccordionItem key="3" title="Генерация клипов">Наша платформа автоматически генерирует клипы из видео.</AccordionItem>
            <AccordionItem key="4" title="Получение обратной связи">Помогайте улучшать нашу платформу, отправляя свои предложения и отзывы.</AccordionItem>
          </Accordion>
        </div>
      </div>
      </section>
    </div>
  );
}
