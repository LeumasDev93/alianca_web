import ButtonBackToPrevious from "@/components/buttonBackToPrev";
import ButtonHelp from "@/components/buttonHelp";
// Header and Footer are now rendered globally in layout with static data
import TopicAlianca from "@/components/TopicsAlianca";

export default function Alianca() {
  return (
    <div className="">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start ">
        <TopicAlianca />
        <ButtonBackToPrevious />
        <ButtonHelp />
      </main>
    </div>
  );
}
