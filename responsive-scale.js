(function (global) {
  const DEFAULTS = {
    designWidth: 1920,
    mobileDesignWidth: 0,
    mobileBreakpoint: 500,
    container: ".container",
    mobileContainer: "",
    fixed: "[data-scale-fixed], .scale-fixed",
    minScale: 0,
    maxScale: 1,
    autoHeight: true,
    bodySetup: true,
    scaleVar: "--responsive-scale",
  };

  const scriptEl = document.currentScript;

  function toNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function toBoolean(value, fallback) {
    if (value == null) return fallback;
    return value !== "false";
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function optionsFromScript() {
    if (!scriptEl) return {};

    return {
      designWidth: toNumber(scriptEl.dataset.designWidth, DEFAULTS.designWidth),
      mobileDesignWidth: toNumber(
        scriptEl.dataset.mobileDesignWidth,
        DEFAULTS.mobileDesignWidth
      ),
      mobileBreakpoint: toNumber(
        scriptEl.dataset.mobileBreakpoint,
        DEFAULTS.mobileBreakpoint
      ),
      container: scriptEl.dataset.container || DEFAULTS.container,
      mobileContainer: scriptEl.dataset.mobileContainer || DEFAULTS.mobileContainer,
      fixed: scriptEl.dataset.fixed || DEFAULTS.fixed,
      minScale: toNumber(scriptEl.dataset.minScale, DEFAULTS.minScale),
      maxScale: toNumber(scriptEl.dataset.maxScale, DEFAULTS.maxScale),
      autoHeight: toBoolean(scriptEl.dataset.autoHeight, DEFAULTS.autoHeight),
      bodySetup: toBoolean(scriptEl.dataset.bodySetup, DEFAULTS.bodySetup),
    };
  }

  function isMobileLayout(options) {
    return (
      options.mobileDesignWidth > 0 &&
      global.innerWidth <= options.mobileBreakpoint
    );
  }

  function getLayoutMode(options) {
    return isMobileLayout(options) ? "mobile" : "desktop";
  }

  function getDesignWidth(options) {
    return getLayoutMode(options) === "mobile"
      ? options.mobileDesignWidth
      : options.designWidth;
  }

  function getScale(options) {
    return clamp(
      global.innerWidth / getDesignWidth(options),
      options.minScale,
      options.maxScale
    );
  }

  function setEarlyScale(options) {
    const root = document.documentElement;
    const layout = getLayoutMode(options);

    root.style.setProperty(DEFAULTS.scaleVar, getScale(options).toFixed(4));
    root.dataset.responsiveScaleLayout = layout;
  }

  function init(userOptions) {
    const options = Object.assign({}, DEFAULTS, optionsFromScript(), userOptions);
    const root = document.documentElement;
    const body = document.body;
    const desktopContainer =
      document.querySelector('[data-scale-container="desktop"]') ||
      document.querySelector('[data-scale-container]:not([data-scale-container="mobile"])') ||
      document.querySelector(options.container);
    const mobileContainer = options.mobileContainer
      ? document.querySelector(options.mobileContainer)
      : document.querySelector('[data-scale-container="mobile"]');

    if (!root || !body || !desktopContainer) return null;

    const fixedElements = Array.from(document.querySelectorAll(options.fixed));
    const containers = [desktopContainer];
    let activeContainer = null;
    let resizeTimer = null;

    if (mobileContainer && mobileContainer !== desktopContainer) {
      containers.push(mobileContainer);
    }

    function getActiveContainer() {
      return getLayoutMode(options) === "mobile" && mobileContainer
        ? mobileContainer
        : desktopContainer;
    }

    function applyBaseStyles() {
      if (options.bodySetup) {
        const bodyDisplay = getComputedStyle(body).display;

        if (bodyDisplay === "block") {
          body.style.display = "flex";
          body.style.flexDirection = "column";
        }

        body.style.overflowX = "hidden";
        body.style.minHeight = "100vh";

        if (bodyDisplay === "block" || bodyDisplay === "flex") {
          body.style.justifyContent = "flex-start";
          body.style.alignItems = "center";
        }
      }

      containers.forEach(function (container) {
        if (!container.style.width && options.mobileDesignWidth <= 0) {
          container.style.width = options.designWidth + "px";
        }

        container.style.transformOrigin = "top center";
        container.style.transform = "scale(var(" + options.scaleVar + ", 1))";
      });

      fixedElements.forEach(function (element) {
        element.style.transformOrigin = "top center";
        element.style.transform = "scale(var(" + options.scaleVar + ", 1))";
      });
    }

    function applyScale() {
      const layout = getLayoutMode(options);
      const designWidth = getDesignWidth(options);

      root.style.setProperty(options.scaleVar, getScale(options).toFixed(4));
      root.style.setProperty("--responsive-layout-width", designWidth + "px");
      root.dataset.responsiveScaleLayout = layout;
    }

    function updateContainers() {
      activeContainer = getActiveContainer();

      containers.forEach(function (container) {
        const isActive = container === activeContainer;
        container.hidden = !isActive;
      });
    }

    function applyHeight() {
      applyScale();
      updateContainers();

      if (!options.autoHeight || !activeContainer) return;

      const rect = activeContainer.getBoundingClientRect();
      const documentBottom = Math.ceil(rect.bottom + global.scrollY);
      const newHeight = documentBottom + "px";

      if (body.style.height !== newHeight) {
        body.style.height = newHeight;
      }

      body.style.marginBottom = "0";
    }

    function scheduleApply() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyHeight, 60);
    }

    applyBaseStyles();
    applyScale();
    requestAnimationFrame(applyHeight);

    global.addEventListener("load", function () {
      applyHeight();
      setTimeout(applyHeight, 500);
    });

    global.addEventListener("resize", scheduleApply);
    global.addEventListener("orientationchange", scheduleApply);

    const mutationObserver = new MutationObserver(function () {
      requestAnimationFrame(applyHeight);
    });

    containers.forEach(function (container) {
      mutationObserver.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });
    });

    return {
      refresh: applyHeight,
      destroy: function () {
        mutationObserver.disconnect();
        global.removeEventListener("resize", scheduleApply);
        global.removeEventListener("orientationchange", scheduleApply);
      },
    };
  }

  const scriptOptions = Object.assign({}, DEFAULTS, optionsFromScript());
  setEarlyScale(scriptOptions);

  global.ResponsiveScaleLayout = {
    init: init,
  };

  if (!scriptEl || scriptEl.dataset.auto !== "false") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        global.ResponsiveScaleLayout.instance = init();
      });
    } else {
      global.ResponsiveScaleLayout.instance = init();
    }
  }
})(window);
