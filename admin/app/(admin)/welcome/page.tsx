import { Topbar } from "@/components/layout/topbar";
import { WelcomeBlockEditor } from "@/components/editor/welcome-block-editor";
import { HtmlHint } from "@/components/editor/html-hint";
import { WELCOME_KEYS, WELCOME_LABELS, getWelcome } from "@/lib/db/queries/welcome";

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const data = await getWelcome();
  return (
    <>
      <Topbar title="Приветствие" description="Тексты, которые видит участник до начала марафона" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <HtmlHint />
        {WELCOME_KEYS.map((key) => (
          <WelcomeBlockEditor
            key={key}
            blockKey={key}
            title={WELCOME_LABELS[key].title}
            hint={WELCOME_LABELS[key].hint}
            initial={data[key]}
          />
        ))}
      </div>
    </>
  );
}
