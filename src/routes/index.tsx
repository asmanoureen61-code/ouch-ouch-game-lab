import { createFileRoute } from "@tanstack/react-router";

import { GameScreen } from "@/game/components/GameScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OUCH OUCH — 3D Poke-the-Guy Browser Game" },
      {
        name: "description",
        content:
          "Tap, poke and smack a 3D ragdoll guy who yells OUCH. Build combos, rack up score. Plays instantly in your browser.",
      },
      { property: "og:title", content: "OUCH OUCH — 3D Poke-the-Guy Browser Game" },
      {
        property: "og:description",
        content: "Tap the 3D guy, hear him yell OUCH, and chain combos for a high score.",
      },
    ],
  }),
  component: GameScreen,
});
