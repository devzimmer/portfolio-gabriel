import { getTranslations } from "next-intl/server";
import { projects } from "@/lib/projects";

export async function Projects() {
  const t = await getTranslations("Projects");

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="scroll-mt-24 border-t border-line bg-ink px-gutter py-section"
    >
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
          <h2
            id="projects-title"
            className="text-eyebrow uppercase text-mute"
          >
            {t("label")}
          </h2>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute">
            {t("meta")}
          </p>
        </div>

        <p className="mt-10 max-w-[42ch] font-serif text-serif italic text-paper lg:mt-14">
          {t("intro")}
        </p>

        <ul className="mt-14 border-b border-line lg:mt-20">
          {projects.map((project, index) => (
            <li key={project.slug} className="border-t border-line">
              <article className="grid gap-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-10">
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute lg:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <div className="lg:col-span-8">
                  <h3 className="text-title text-fog">
                    {t(`items.${project.slug}.title`)}
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-body text-mute">
                    {t(`items.${project.slug}.summary`)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:col-span-3 lg:flex-col lg:items-end lg:gap-2 lg:text-right">
                  {project.placeholder ? (
                    <span className="border border-line px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-mute">
                      {t("placeholder")}
                    </span>
                  ) : null}

                  {project.stack?.length ? (
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute">
                      {project.stack.join(" · ")}
                    </p>
                  ) : null}

                  {project.year ? (
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute">
                      {project.year}
                    </p>
                  ) : null}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
