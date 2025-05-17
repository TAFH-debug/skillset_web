"use client";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Accordion, AccordionItem } from "@heroui/accordion";
import Block from "@/components/block";
import { title } from "@/components/primitives";
import { Upload } from 'lucide-react';
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
    <div className="relative flex flex-col items-center overflow-x-hidden ">
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 w-screen">
        <div className="inline-block max-w-xl text-center justify-center mb-8 ">
            <span className={title()}>
            Fast AI Video Editing
            </span>
        </div>

      <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          <span>Upload a file</span>
          <input type="file" name="file" />
        </label>
        <button type="submit">Submit</button>
      </Form>
        <div className="cursor-pointer">
          <Button size="lg" color="primary" className="" endContent={<Upload size={16}/>}>Get started</Button>
        </div>
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
