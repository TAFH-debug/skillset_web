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

const example: Clip[] = [];

export default function Home() {
  const [clips, setClips] = useState<Clip[]>(example);
  const [progress, setProgress] = useState("");

  const handleSubmit = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    let file = event.target.files![0];

    setProgress("Uploading...");

    const formData = new FormData();
    formData.append("file", file); 

    const response = await axios.post("/api/s3/upload", formData);
    
    setProgress("Uploading to S3...");
    const link = response.data.downloadUrl;

    setProgress("Generating highlights...");

    const highlights = await axios.post("/api/video/highlights", { file: link });

    setProgress("");

    setClips(highlights.data.outputs);
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
          </div> : <div>
            <Input
              type="file"
              name="file" 
              size="lg" 
              color="primary" 
              accept=".mp4, .mov, .webm"
              endContent={<Upload size={16}/>}
              onChange={handleSubmit}
            />
          </div>
        }
        {
          clips.length > 0 && (
            <div className="flex flex-wrap gap-4 max-w-full items-center justify-center">
              {clips.map((clip) => (
                <ReactPlayer controls={true} url={clip.data[0].url} key={clip.data[1].title} width={400} />
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
            <AccordionItem key="1" title="Сценарные симуляции">Моделирование реальных ситуаций (захват заложников, киберпреступления, патрулирование).</AccordionItem>
            <AccordionItem key="2" title="Анализ действий">Подробный разбор результатов и персонализованные рекомендации по улучшению.</AccordionItem>
            <AccordionItem key="3" title="Многопользовательский режим">Совместные тренировки и отработка взаимодействия в команде.</AccordionItem>
            <AccordionItem key="4" title="Виртуальная реальность">Глубокое погружение для максимальной реалистичности.</AccordionItem>
            <AccordionItem key="5" title="Теоретический блок">Доступ к справочникам, нормативным актам и учебным материалам.</AccordionItem>
          </Accordion>
        </div>
        <div>
          <Block BlockTitle="Как наша платформа улучшает навыки?"/>
          <Accordion variant="shadow" >
            <AccordionItem key="1" title="Регистрация">Создайте учетную запись и получите доступ к платформе.</AccordionItem>
            <AccordionItem key="2" title="Выбор сценария">Выберите интересующую ситуацию для тренировки (например, патруль, переговоры с преступником и т. д.).</AccordionItem>
            <AccordionItem key="3" title="Выполнение заданий">Выполняйте задания в режиме VR или на обычном компьютере, анализируйте результаты.</AccordionItem>
            <AccordionItem key="4" title="Получение обратной связи">Изучайте отчеты по эффективности, улучшайте навыки.</AccordionItem>
          </Accordion>
        </div>
      </div>
      </section>
    </div>
  );
}
