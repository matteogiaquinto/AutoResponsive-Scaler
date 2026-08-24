# AutoResponsive-Scaler - AI Installation Context

Use this context when asking an AI coding agent to install AutoResponsive-Scaler into an existing website.

AutoResponsive-Scaler makes fixed-width web layouts responsive by scaling the layout with CSS transforms. It is useful for art-directed websites where the designer wants to preserve a precise desktop composition, with an optional separately designed mobile composition below a chosen breakpoint.

## Instructions For AI Agents

You are integrating AutoResponsive-Scaler into an existing website.

Follow these rules strictly:

1. **Preserve the existing design and code structure as much as possible.**
2. **Do not rebuild the website's responsive system from scratch.**
3. **Do not refactor unrelated HTML, CSS, or JavaScript.**
4. **Do not remove existing responsive CSS unless the user explicitly asks you to.**
5. **Do not rename or remove AutoResponsive-Scaler `data-` attributes.**
6. **Use a tagged CDN version for production unless the user asks for `@main`.**
7. **If the site already has a complex mobile layout, preserve it and use it as the mobile composition when appropriate.**
8. **If an element already uses `transform`, do not overwrite it blindly. Wrap the scalable content in another element or choose a safer target.**
9. **After implementation, verify there is no horizontal overflow and that the page scroll height matches the scaled content.**

## When To Ask Before Editing

Ask the user for clarification before writing code if:

- you cannot identify the main HTML entry file;
- the design width is unclear and cannot be inferred from the existing CSS;
- the site has multiple layout systems and it is unclear which one should be scaled;
- the site already has a separate mobile layout that might conflict with scaling;
- the main wrapper already relies on CSS transforms.

If the user has clearly asked you to install AutoResponsive-Scaler, proceed with the safest implementation and report your assumptions.

## Dependency

Use the stable jsDelivr CDN version:

```html
<script
  src="https://cdn.jsdelivr.net/gh/matteogiaquinto/AutoResponsive-Scaler@0.2.1/responsive-scale.js"
  data-design-width="1920"
></script>
```

Use `@main` only for testing the latest development version:

```html
<script
  src="https://cdn.jsdelivr.net/gh/matteogiaquinto/AutoResponsive-Scaler@main/responsive-scale.js"
  data-design-width="1920"
></script>
```

Mobile-layout support is available from `0.2.0`. Use `@main` only to test unreleased development changes.

## Core Markup Pattern

Put the scalable page content inside one wrapper:

```html
<body>
  <header data-scale-fixed>
    ...
  </header>

  <div class="container">
    ...
  </div>
</body>
```

The fixed header is outside the scalable container, so it uses `data-scale-fixed`.

If the existing project already uses `.container` for another framework or design system, do not reuse it blindly. Prefer a dedicated wrapper:

```html
<main class="page-scale" data-scale-container>
  ...
</main>
```

## Core CSS Pattern

Set the design width on the scalable wrapper:

```css
.container {
  width: 1920px;
}
```

Or, for a custom wrapper:

```css
.page-scale {
  width: 1920px;
}
```

The script handles:

- `transform: scale(...)`;
- `transform-origin: top center`;
- horizontal overflow setup;
- corrected `body` height after scaling.

Do not duplicate those transform rules unless there is a project-specific reason.

## Mobile Layout Pattern

Use the same HTML and recompose it in CSS below the breakpoint. Both layout widths must be fixed:

```html
<script
  src="https://cdn.jsdelivr.net/gh/matteogiaquinto/AutoResponsive-Scaler@0.2.1/responsive-scale.js"
  data-design-width="1920"
  data-mobile-design-width="500"
  data-mobile-breakpoint="500"
></script>
```

```css
.container { width: 1920px; }

@media (max-width: 500px) {
  .container { width: 500px; }
  /* Reorganize the same HTML for the mobile composition here. */
}
```

If the project needs distinct wrappers, use `data-scale-container="desktop"` and `data-scale-container="mobile"`. The script displays the active wrapper and hides the inactive one.

## Options

The most common option is `data-design-width`.

Use the width the site was designed for:

```html
<script
  src="https://cdn.jsdelivr.net/gh/matteogiaquinto/AutoResponsive-Scaler@0.2.1/responsive-scale.js"
  data-design-width="1440"
></script>
```

Available script attributes:

```html
<script
  src="https://cdn.jsdelivr.net/gh/matteogiaquinto/AutoResponsive-Scaler@0.2.1/responsive-scale.js"
  data-design-width="1920"
  data-mobile-design-width="500"
  data-mobile-breakpoint="500"
  data-container=".container"
  data-mobile-container=".mobile-container"
  data-fixed="[data-scale-fixed], .scale-fixed"
  data-max-scale="1"
  data-min-scale="0"
  data-auto-height="true"
  data-body-setup="true"
></script>
```

Important public attributes:

- `data-scale-container`: marks the scalable wrapper directly.
- `data-scale-fixed`: marks fixed elements that should scale with the layout.
- `data-design-width`: the width used to design the fixed layout.
- `data-mobile-design-width`: enables a separately designed mobile layout when set to a value greater than `0`.
- `data-mobile-breakpoint`: width at or below which the mobile layout is active.
- `data-mobile-container`: selector for an optional separate mobile wrapper.
- `data-max-scale`: prevents scaling larger than the design size.
- `data-min-scale`: optional minimum scale.
- `data-auto-height`: controls body height correction.
- `data-body-setup`: controls automatic basic body setup.

## Implementation Steps

1. Inspect the project structure.
2. Identify the main HTML entry file or template.
3. Identify the fixed design width from CSS, design notes, or the largest layout wrapper. Use `1920` only when no better value is available.
4. Find or create a scalable wrapper for the page content.
5. If a separate mobile composition is needed, identify its fixed design width and breakpoint, then add `data-mobile-design-width` and mobile CSS for the same markup or a dedicated mobile wrapper.
6. Ensure every active wrapper has its fixed design width in CSS.
7. Add `data-scale-container` if using a custom wrapper or if `.container` is ambiguous.
8. Add `data-scale-fixed` to fixed headers, navbars, or floating UI outside the scalable wrapper.
9. Add the CDN script in the `<head>` so the scale value is available early.
10. Preserve existing scripts and styles.
11. Test representative viewport widths.
12. Report the files changed and the design widths and breakpoint used.

## Verification Checklist

Verify at least these widths when possible:

- `1920px`
- `1440px`
- `1366px`
- `1024px`
- `500px` when mobile scaling is enabled
- a smaller representative mobile width, such as `390px`

Check:

- no horizontal scrollbar;
- header or fixed nav remains aligned;
- body scroll height reaches the real bottom of the scaled content;
- major images and text remain visible;
- existing interactions still work;
- no console errors caused by the integration.

## Limitations To Communicate

Tell the user when relevant:

- This is a transform-based scaling system, not a full responsive framework.
- Text, images, buttons, and hit targets scale together.
- Very small mobile screens may still need a separate mobile layout.
- Existing transforms on the target wrapper can conflict with the scaler.
- Complex modals, sticky sections, scroll animations, or viewport-based interactions may need manual adjustment.

## Expected Response Format

If the user only pasted this context and has not asked for a specific action, respond with:

1. A one-sentence summary of what AutoResponsive-Scaler does.
2. These questions:

   - Are you integrating this into an existing project, and what stack is it using?
   - What design width should be used, or should I infer it from the CSS?
   - Should the scaler apply to the whole site or only specific pages?
   - Are there fixed headers/navbars that should scale with the layout?
   - Does the site already have a separate mobile layout that must be preserved?

If the user asks you to install it, implement it directly, verify it, and summarize the exact changes.
