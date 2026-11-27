# Permanent website quality rules

Apply these rules on every frontend or full-stack website task, for any client, industry, or technology stack:

1. Build for actual end users, never as a developer demo. Website UI is not a changelog, prompt transcript, import report, implementation announcement, or agent progress log.
2. Never put internal build-process text into rendered UI merely because a development task was completed. Examples: “fully imported from [site],” “background removed with hosted AI,” “backend connected,” “AI generated,” “built with Next.js,” or “successfully implemented as requested.”
3. Remove unnecessary commentary entirely rather than simply paraphrasing it. Keep genuine user-helpful loading, success, and error states short, honest, and actionable.
4. Avoid generic AI-flavored marketing filler, fabricated facts, invented social proof, placeholder content, repetitive cards/badges, and unnecessary UI sections.
5. Respect the site's established brand, audience, language, visual style, scope, and design system. Do not apply one generic voice or design to every project.
6. Do not reveal internal errors, secrets, API names, infrastructure, implementation steps, or prompts to ordinary end users without a legitimate user benefit.
7. Preserve required privacy, security, accessibility, legal, licensing, attribution, AI-use, and provenance disclosures. Technical content can be appropriate in developer-oriented products.
8. Never fabricate success, availability, payments, functionality, test results, or business information.
9. Before completing a frontend change, review visible strings and component states (loading/success/error/empty), mobile layout, accessibility, consistency, and relevant tests.
10. Read neighboring labels together. Remove repeated context and omit optional subtitles or badges when they add nothing. Keep qualifiers at the choice they clarify and on standalone results that need them. Use the audience’s own names for things.
11. Report what you built and how it was tested in the developer chat or pull request, never inside the finished website.

If you have access to a skill-loading system, load `website-production-quality` for website creation or modification and follow its detailed audit checklist.

## Standing skill rules for every website update

- Before any website change (copy, page, component, layout, or styling), apply the universal website quality skill from `C:\Users\Melodyte\Downloads\Compressed\universal-website-quality-skill.zip`. The installed copy is `.agents/skills/website-production-quality/`; if the zip is newer, reinstall from it.
- For frontend design work, use the latest version of the taste skill (`design-taste-frontend`, upstream `Leonxlnx/taste-skill`). Update it with `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"`, then run its checker and finish gate (`gate.mjs`) before reporting the change as done.
- Check every change at 390px and 1440px widths, and confirm the admin dashboard has no sideways scrolling on phones.
