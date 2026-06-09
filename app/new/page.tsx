import Link from "next/link";
import TemplatePicker from "@/components/TemplatePicker";
import Heart from "@/components/Heart";

export default function NewRetroPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="window overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-ash-border bg-cream-paper">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-dark-olive hover:text-bark"
          >
            <span aria-hidden>&#8249;</span> Home
          </Link>
          <Heart />
        </div>

        <div className="p-5 sm:p-10">
          <h1 className="text-heading-sm sm:text-heading font-semibold text-bark">
            New retrospective
          </h1>
          <p className="text-body text-dark-olive mt-2 mb-7 sm:mb-8">
            Choose a template to start. Your board is anonymous and saved in this browser.
          </p>
          <TemplatePicker />
        </div>
      </div>
    </main>
  );
}
