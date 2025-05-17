"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import Block from "@/components/block";
import { title } from "@/components/primitives";
import { Upload } from 'lucide-react';
import { Input } from "@heroui/input";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const example: Clip[] = [
  {
    "data": [
      {
        "url": "https://sieve-prod-us-central1-persistent-bucket.storage.googleapis.com/34ddfdf0-a8c3-4763-8acd-7a2b93ed1a4f/57f80f07-780a-49d6-a2b3-6f3744635ef7/68f98c7c-5997-4b3d-97f6-48f0ce7f2566/tmp991k8li7.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=abhi-admin%40sieve-grapefruit.iam.gserviceaccount.com%2F20250517%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250517T120708Z&X-Goog-Expires=172800&X-Goog-SignedHeaders=host&x-goog-signature=0683d1d3765ef95ef2d5bf63f08ee2057fc732b3e6805f1be434e2d96e0f01905ba15a0a67cfc2468a73abfbe8117d48b34b9608d453a2626892a70630c81aff36687ff692ba66ddb30a0d0fe4c4ae660596104e33bd865fcea283fd77cb4197ba7c2ac9d382f295ff51392825c45593ba1bdddcefdbbc311c285ddbb75dd8a204cad3c8603cf50b8b04fb4cede894aec6a4f249b69f6529a44205927d7945678c4bf543e018074073fe9f0ed92e45a4a4f6459dfe6c7554bfe0c07cdbbc11860f95e9659ffd69388b910e136d1d6ca0e9ae8e9bd55890bfd383a5deb2c3e2dc12f92f2fcc06eae8778cbf6abc6bc2696d28f650c44464cf7061d7ed0951f87a",
      },
      {
        "title": "Most Viral Clip Highlight 2",
      }
    ],
  },
  {
    "data": [
      {
        "url": "https://sieve-prod-us-central1-persistent-bucket.storage.googleapis.com/34ddfdf0-a8c3-4763-8acd-7a2b93ed1a4f/57f80f07-780a-49d6-a2b3-6f3744635ef7/1fac4e63-45c5-4e3d-82e0-e58adb07223d/tmp4tudynuq.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=abhi-admin%40sieve-grapefruit.iam.gserviceaccount.com%2F20250517%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250517T120711Z&X-Goog-Expires=172800&X-Goog-SignedHeaders=host&x-goog-signature=7526a9957a8cb6dd0d21daa2cd29fc596a442f41b298376ea0555e7f812b5beabd0dd8c548298cd9f4574ac2733ce3f9e201af973202d5b4072b7ef2a45181c26f42a7061024c566e8b7f016cb361f87b74ec264a38b48fa5fc31da055d98f248f8f050a00175d68b138fb6ec735168a4a41a908a87f4a134d362fbd43646bba069cacfeb6e040e59c85aed02debea10646417487a262d73e5ed0413f53bf6f4ec1a166df41040c42c2fe1beda46434413e8b213e9f7d67bfa4fc65b0a42f7f5925119ae1ac3f6796d03d77a45a7339b4f753b965fd628087cbbf63c3d13c6ab0bc7a7ac2f8fb70444e7ce368260e417662b0f44300d121f0db260aba8c99e80",
      },
      {
        "title": "Most Viral Clip Highlight 1",
      }
    ],
  },
  {
    "data": [
      {
        "url": "https://sieve-prod-us-central1-persistent-bucket.storage.googleapis.com/34ddfdf0-a8c3-4763-8acd-7a2b93ed1a4f/57f80f07-780a-49d6-a2b3-6f3744635ef7/573cf606-35a3-4c04-a3c0-343e56ed5c8a/tmpb7dt0pw8.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=abhi-admin%40sieve-grapefruit.iam.gserviceaccount.com%2F20250517%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250517T120711Z&X-Goog-Expires=172800&X-Goog-SignedHeaders=host&x-goog-signature=1b9b3097568ed6996853a1fe730a5db6227d65371ed4339c043d041b2d77f1cb67228349293e59aca036c49ba52b292d455df50b5afad01f9fbc0f043c5b6da03af3f77bbf8291e222df06e1d5bd12cfbc7c7fddcbad078bdc50213f84d09257d1150c373e10e395973256b79189c6ccce3a16ee1e56baec08e0789fd01dccc57c22b669b19613ad758309308e25223a0db01b0883f361fb845163d0cbad509961287c9aaf454677a3d93cdb748d2ec170f1e5b993df1063a0a4eb0d95e1a08adccef715921142366f7cb184f41884564b25133741737f206a77d1bbe9db04c67347f332cccea6270e0fa5069571c46d9b58d93602ede7f53902199a0c7e39ee",
      },
      {
        "title": "Most Viral Clip Highlight 3",
      }
    ],
  }
];

const ffmpeg = new FFmpeg();

export default function Home() {
  const [clips, setClips] = useState<Clip[]>(example);
  
  useEffect(() => {
    ffmpeg.load();
  }, []);

  const handleSubmit = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    // Convert uploaded file to mp4 if needed
    const file = event.target.files![0];
    if (!file.type.includes('mp4')) {
      console.log("Converting to mp4");

      await ffmpeg.writeFile(file.name, await fetchFile(file));
      
      await ffmpeg.exec(['-i', file.name, 'output.mp4']);
      
      console.log("Reading file");
      const data = await ffmpeg.readFile('output.mp4');
      const mp4File = new File([data], 'converted.mp4', { type: 'video/mp4' });
      
      event.target.files = {
        0: mp4File,
        length: 1,
        item: (index: number) => mp4File
      } as unknown as FileList;
    }

    console.log(event.target.files![0].name);

    const formData = new FormData();
    formData.append("file", event.target.files![0]); 

    const response = await axios.post("/api/s3/upload", formData);
    
    const link = response.data.downloadUrl;
    console.log(link);

    const highlights = await axios.post("/api/video/highlights", { file: link });
    console.log(highlights.data.outputs);

    setClips(highlights.data.outputs);
  }

  return (
    <div className="relative flex flex-col items-center overflow-x-hidden ">
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center mb-8 ">
            <span className={title()}>
            Fast AI Video Editing
            </span>
        </div>

        <div>
          <Input
            type="file"
            name="file" 
            size="lg" 
            color="primary" 
            endContent={<Upload size={16}/>}
            onChange={handleSubmit}
          />
        </div>
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
        <div  >
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
