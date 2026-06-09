import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import Heart from "@/components/Heart";

const TEMPLATE_PREVIEW = [
  { name: "Mad / Sad / Glad", cols: ["#f54e00", "#2f80fa", "#f1a82c"] },
  { name: "Liked / Learned / Lacked", cols: ["#6aa84f", "#2f80fa", "#f54e00"] },
  { name: "Start / Stop / Continue", cols: ["#6aa84f", "#f54e00", "#2f80fa"] },
];

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <nav className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10">
        <Wordmark size="lg" />
        <Link href="/new" className="btn-ghost">
          New retrospective
        </Link>
      </nav>

      <div className="window overflow-hidden">
        <div className="flex items-center justify-end px-4 sm:px-6 py-3 border-b border-ash-border bg-cream-paper">
          <Heart />
        </div>

        <div className="p-5 sm:p-12">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 items-center">
            <div>
              <h1 className="font-display text-heading sm:text-display text-bark leading-tight">
                Go back in time to improve the future
              </h1>
              <p className="text-body text-dark-olive mt-4">
                The easiest way to run engaging online retrospectives for your
                remote or hybrid teams. No sign up, fully anonymous.
              </p>
              <div className="mt-6 sm:mt-7 flex flex-wrap gap-3">
                <Link href="/new" className="btn-primary">
                  Create free, anonymous retro
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {TEMPLATE_PREVIEW.map((t) => (
                <div
                  key={t.name}
                  className="bg-cream-paper border border-ash-border rounded-large p-4"
                >
                  <div className="flex gap-1.5 mb-3">
                    {t.cols.map((c, i) => (
                      <span key={i} className="h-2 flex-1 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-bark">{t.name}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <p className="text-center text-caption text-olive/70 mt-6">
        For small teams - cards, votes, timer, action points and export. All in your browser.
      </p>
    </main>
  );
}
