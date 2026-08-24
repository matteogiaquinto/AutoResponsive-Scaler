# AutoResponsive-Scaler

Make fixed, art-directed layouts scale fluidly without recreating every intermediate breakpoint.

Best for desktop-first pages that preserve a precise composition. Version 0.2 can also switch to a separately designed mobile composition, then scale that layout below its breakpoint.

> Status: `0.2.1` experimental. This is an intentional shortcut, not a universal responsive-design replacement.

## Quick Start

Load the stable release in the `<head>`:

```html
<script
  src="https://cdn.jsdelivr.net/gh/matteogiaquinto/AutoResponsive-Scaler@0.2.1/responsive-scale.js"
  data-design-width="1920"
></script>
```

Wrap the page content and build it at the design width:

```html
<body>
  <header data-scale-fixed>...</header>
  <div class="container">...</div>
</body>
```

```css
.container {
  width: 1920px;
}
```

The script applies the scale, prevents horizontal overflow, and corrects the document height after the transform.

For an AI-assisted installation, use [the installation context](docs/ai-install-prompt.md). For development against the latest source, replace `@0.2.1` with `@main`.

## Desktop And Mobile Layouts

Enable a mobile composition by adding a second design width. The desktop layout scales from `1920px` down to `500px`; at `500px` and below, the mobile layout is active and scales from its own `500px` design width.

```html
<script
  src="./responsive-scale.js"
  data-design-width="1920"
  data-mobile-design-width="500"
  data-mobile-breakpoint="500"
></script>
```

Keep the same HTML and recompose it in CSS:

```css
.container {
  width: 1920px;
}

@media (max-width: 500px) {
  .container {
    width: 500px;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
```

When mobile scaling is enabled, define both layout widths in CSS. The script uses the active layout width to calculate the scale and exposes the active mode on `<html>` as `data-responsive-scale-layout="desktop"` or `"mobile"`.

If the compositions need separate wrappers, use one for each mode. The script shows the active wrapper and hides the other:

```html
<main data-scale-container="desktop" class="desktop-layout">...</main>
<main data-scale-container="mobile" class="mobile-layout">...</main>
```

Give each wrapper its fixed design width in CSS. Alternatively, select the mobile wrapper explicitly with `data-mobile-container=".mobile-layout"`.

## Fixed Elements

Mark a fixed header, floating navigation, or other element outside the page wrapper with `data-scale-fixed`:

```html
<header data-scale-fixed>...</header>
```

It receives the same active scale as the main layout.

## Options

Add options to the script tag:

```html
<script
  src="./responsive-scale.js"
  data-design-width="1440"
  data-mobile-design-width="500"
  data-mobile-breakpoint="500"
  data-container=".page"
  data-mobile-container=".page-mobile"
  data-fixed=".site-header"
  data-max-scale="1"
  data-min-scale="0"
></script>
```

| Attribute | Default | Description |
| --- | --- | --- |
| `data-design-width` | `1920` | Width used to design the desktop layout. |
| `data-mobile-design-width` | disabled | Width used to design the mobile layout. Enables mobile mode when greater than `0`. |
| `data-mobile-breakpoint` | `500` | Viewport width at or below which mobile mode is active. |
| `data-container` | `.container` | Selector for the desktop or shared scalable wrapper. |
| `data-mobile-container` | none | Selector for a separate mobile wrapper. |
| `data-fixed` | `[data-scale-fixed], .scale-fixed` | Selector for fixed elements that should scale too. |
| `data-max-scale` | `1` | Prevents a layout from scaling larger than its design size. |
| `data-min-scale` | `0` | Optional minimum scale. Keep `0` if the layout should always fit. |
| `data-auto-height` | `true` | Updates `body` height after scaling. |
| `data-body-setup` | `true` | Applies basic body styles needed for centered scaling. |
| `data-auto` | `true` | Set to `false` for manual initialization. |

## Manual Initialization

```html
<script src="./responsive-scale.js" data-auto="false"></script>
<script>
  ResponsiveScaleLayout.init({
    designWidth: 1920,
    mobileDesignWidth: 500,
    mobileBreakpoint: 500,
    container: ".container",
    fixed: "header"
  });
</script>
```

Refresh measurements after custom or asynchronous layout changes:

```js
ResponsiveScaleLayout.instance.refresh();
```

## How It Works

```txt
desktop: scale = viewport width / desktop design width
mobile:  scale = viewport width / mobile design width
```

The script applies `transform: scale(var(--responsive-scale))` from the top center. Because transforms do not affect document flow, it measures the scaled active wrapper and sets the appropriate `body` height.

## Limitations

- A mobile layout still needs to be designed in CSS; the script scales it but does not create its visual hierarchy.
- Text, images, buttons, and hit targets all scale down together.
- Browser zoom and accessibility text scaling are not the same as true responsive typography.
- The script writes `transform` on the scalable wrapper and fixed elements. Wrap an element if it needs its own transform.
- CSS transforms create stacking contexts, which can affect z-index behavior.
- Viewport-based components such as modals, side menus, sticky sections, or scroll animations need manual testing.
- If content changes after async loading, call `ResponsiveScaleLayout.instance.refresh()`.

## Development

```bash
npm test
npm pack --dry-run
```

## License

MIT
