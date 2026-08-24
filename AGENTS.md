# AGENTS.md

Instructions for AI coding agents maintaining this repository.

This file is about working **on AutoResponsive-Scaler itself**. It is not an installation prompt for adding AutoResponsive-Scaler to another website.

## Project Purpose

AutoResponsive-Scaler is a small dependency-free JavaScript utility that makes fixed-width web layouts scale fluidly with CSS transforms.

It is best for art-directed, desktop-first websites where the user wants to preserve one precise layout instead of redesigning every breakpoint.

Do not present it as a universal responsive design replacement.

## Important Files

- `responsive-scale.js` is the main source file.
- `README.md` is the public documentation and should stay clear, honest, and copy-paste friendly.
- `CHANGELOG.md` records user-facing changes.
- `package.json` stores package metadata, scripts, and the current version.
- `examples/basic/index.html` is the working demo and should stay functional.
- `.github/workflows/ci.yml` runs the basic CI check.

## Development Rules

- Keep the library dependency-free.
- Keep the browser usage simple: one script tag should be enough for the default setup.
- Do not add a build step unless it clearly solves a real distribution problem.
- Do not introduce a framework, bundler, or TypeScript conversion without explicit maintainer approval.
- Keep the script usable from jsDelivr and direct `<script>` tags.
- If a new user-facing option is added, document it in `README.md`.
- If behavior changes, update `examples/basic/index.html` when relevant.
- Keep comments concise and only where they clarify non-obvious behavior.

## Usage Contract

Treat these as public usage surfaces:

- `data-design-width`
- `data-container`
- `data-fixed`
- `data-max-scale`
- `data-min-scale`
- `data-auto-height`
- `data-body-setup`
- `data-auto`
- `data-scale-fixed`
- `data-scale-container`
- `ResponsiveScaleLayout.init(...)`
- `ResponsiveScaleLayout.instance.refresh()`

Renaming or removing any of these is a breaking change.

## Versioning

While the project is in `0.x`:

- Patch versions are for bug fixes, documentation corrections, and small internal improvements.
- Minor versions are for new options, meaningful behavior changes, or breaking changes.
- `1.0.0` means the way people use the script is considered stable.

After `1.0.0`:

- Patch versions are for compatible bug fixes.
- Minor versions are for backward-compatible features.
- Major versions are for breaking changes.

Keep `package.json`, `CHANGELOG.md`, README CDN examples, Git tags, and GitHub releases aligned.

## Release Process

Before releasing:

1. Update `package.json` to the target version.
2. Update `CHANGELOG.md` with the release date and user-facing changes.
3. Update README CDN snippets if the recommended version changes.
4. Run `npm test`.
5. Run `npm pack --dry-run`.
6. Commit the version changes.
7. Push `main`.
8. Create and push the matching Git tag:

   ```bash
   git tag VERSION
   git push origin VERSION
   ```

9. Verify the tagged jsDelivr URL:

   ```txt
   https://cdn.jsdelivr.net/gh/matteogiaquinto/AutoResponsive-Scaler@VERSION/responsive-scale.js
   ```

Use tagged CDN URLs for production documentation. `@main` is acceptable only as a latest-development option.

## README Rules

- Keep the opening pitch short and clear.
- Keep the Quick Start copy-paste friendly.
- Do not remove the Limitations section.
- Do not oversell the project as a complete responsive design solution.
- CDN snippets must point to existing tags.
- If a demo URL is documented, verify it works first.
- Prefer practical examples over abstract explanations.

## Testing

Always run:

```bash
npm test
```

Before a release, also run:

```bash
npm pack --dry-run
```

When changing runtime behavior, manually verify the demo at representative widths such as:

- `1920px`
- `1440px`
- `1366px`
- `1024px`

Check that there is no horizontal overflow and that the body height follows the scaled content.

## Git And GitHub Rules

- Check `git status` before editing, committing, pulling, or pushing.
- Never force-push unless the maintainer explicitly asks for it.
- If `origin/main` has new commits, fetch and integrate them instead of overwriting them.
- Preserve changes made directly on GitHub.
- Do not move or delete existing tags unless explicitly requested.
- Keep commits focused and use clear commit messages.

## CDN Rules

jsDelivr versioned URLs depend on Git tags. For example, this URL only works if the `0.1.0` tag exists:

```txt
https://cdn.jsdelivr.net/gh/matteogiaquinto/AutoResponsive-Scaler@0.1.0/responsive-scale.js
```

Do not document a versioned CDN URL before the matching tag exists and has been verified.

## Things To Avoid

- Do not turn this into a full responsive framework.
- Do not add dependencies for convenience.
- Do not rename public data attributes casually.
- Do not remove warnings about limitations.
- Do not publish release documentation without a matching tag.
- Do not make unrelated formatting churn across the repo.
