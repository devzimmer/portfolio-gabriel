import { render, screen } from "@testing-library/react";
import { ButtonLink } from "./button-link";
import { SectionLabel } from "./section-label";

it("SectionLabel renders an h2 with the joined label when id is given", () => {
  render(<SectionLabel index="01" label="Trabalhos selecionados" meta="3 cases" id="work-title" />);
  const heading = screen.getByRole("heading", { level: 2 });
  expect(heading).toHaveTextContent("01 — Trabalhos selecionados");
  expect(heading).toHaveAttribute("id", "work-title");
  expect(screen.getByText("3 cases")).toBeInTheDocument();
});

it("SectionLabel renders no heading without id", () => {
  render(<SectionLabel index="02" label="Processo" />);
  expect(screen.queryByRole("heading")).toBeNull();
  expect(screen.getByText("02 — Processo")).toBeInTheDocument();
});

it("ButtonLink external opens safely in a new tab", () => {
  render(
    <ButtonLink href="https://github.com/devzimmer" variant="outline" external>
      GitHub
    </ButtonLink>,
  );
  const link = screen.getByRole("link", { name: "GitHub" });
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
});

it("ButtonLink internal stays in the same tab", () => {
  render(<ButtonLink href="#work" variant="solid">Ver cases</ButtonLink>);
  expect(screen.getByRole("link", { name: "Ver cases" })).not.toHaveAttribute("target");
});
