import { getTutorial } from "@/lib/tutorials";
import { TutorialPlayer } from "@/components/player/tutorial-player";
import { notFound } from "next/navigation";

export default async function PlayPage({
  params,
}: {
  params: Promise<{ tutorialId: string }>;
}) {
  const { tutorialId } = await params;
  const tutorial = await getTutorial(tutorialId);

  if (!tutorial) {
    notFound();
  }

  return <TutorialPlayer tutorial={tutorial} />;
}
