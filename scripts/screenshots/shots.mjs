// What the guide on the website shows, one entry per image in its public/screenshots.
//
// A shot: { name, model?, width?, height?, scale?, app?, viewer?, firstVisit?, url?, setup?(page, helpers),
//           clip?(page, helpers) → selector(s) or boxes, pad? }
// Models are files in ./models; `viewer` and `app` seed the persisted stores before the app loads.

/** The app's labels in the language being shot, by key; looked up, never written out. */
let messages = {};

export const setMessages = (m) => {
  messages = m;
};

/** A label of the app in the current language, by its message key in the app. */
const t = (key) => {
  const value = messages[key];
  if (typeof value !== 'string') throw new Error(`No message ${key}`);
  return value;
};

const drawer = '.v-navigation-drawer--active';
const dialog = '.v-overlay--active > .v-overlay__content > .v-card';

const wait = (page, ms = 400) => page.waitForTimeout(ms);

const openMenu = async (page) => {
  await page.click('#appMenu');
  await wait(page);
};

const menuItem = async (page, label) => {
  await openMenu(page);
  await page.locator(drawer).getByText(label, { exact: true }).click();
  await wait(page, 700);
};

const bottomTab = async (page, label) => {
  await page.locator('#bottomBar .v-tab').filter({ hasText: label }).first().click();
  await wait(page, 300);
};

/** The n-th bottom-bar toolbar button with this label (both "Add node" buttons share one). */
const toolbarButton = async (page, label, n = 0) => {
  await page.locator('#bottomBar .v-btn').filter({ hasText: label }).nth(n).click();
  await wait(page, 700);
};

/** Read from the DOM, because a node is a zero-height polyline that Playwright counts as hidden. */
const rectOf = (page, selector) =>
  page.evaluate((selector) => {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`Not found: ${selector}`);
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: Math.max(r.width, 1), height: Math.max(r.height, 1) };
  }, selector);

const centerOf = async (page, selector) => {
  const box = await rectOf(page, selector);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

const nodeSel = (label) => `polyline[data-label="${label}"]`;
const elementSel = (label) => `[data-element-id="${label}"]`;

const clickNode = async (page, label) => {
  const { x, y } = await centerOf(page, nodeSel(label));
  await page.mouse.click(x, y);
  await wait(page, 500);
};

const clickElement = async (page, label, at = 0.3) => {
  const box = await rectOf(page, elementSel(label));
  await page.mouse.click(box.x + box.width * at, box.y + box.height * at);
  await wait(page, 500);
};

const hoverNode = async (page, label) => {
  const { x, y } = await centerOf(page, nodeSel(label));
  await page.mouse.move(x, y);
  await wait(page, 600);
};

/** Picks an option of the Vuetify select labelled `label` inside `scope`. */
const choose = async (page, scope, label, option) => {
  await page.locator(scope).locator('.v-input').filter({ hasText: label }).first().locator('.v-field').click();
  await wait(page, 300);
  await page.locator('.v-overlay--active .v-list-item').filter({ hasText: option }).first().click();
  await wait(page, 400);
};

/** Types into the text field labelled `label` inside `scope`. */
const type = async (page, scope, label, value, n = 0) => {
  const input = page.locator(scope).locator('.v-input').filter({ hasText: label }).nth(n).locator('input');
  await input.fill(String(value));
  await wait(page, 150);
};

const fit = async (page) => {
  await page.keyboard.press('f');
  await wait(page, 500);
};

/** Fit, then one zoom step out, so labels at the edges are not cut off by a tight crop. */
const fitLoose = async (page) => {
  await fit(page);
  await page.keyboard.press('Control+Minus');
  await wait(page, 500);
};

/** Numbered markers drawn over the app, for images whose text refers to their parts by number. */
const callouts = async (page, items) => {
  for (const { selector, n, at = 'left', box: given } of items) {
    const box = given ?? (await page.locator(selector).first().boundingBox());
    if (!box) throw new Error(`No callout target: ${selector}`);
    await page.evaluate(
      ({ box, n, at }) => {
        const size = 26;
        const outline = document.createElement('div');
        Object.assign(outline.style, {
          position: 'fixed',
          left: `${box.x - 3}px`,
          top: `${box.y - 3}px`,
          width: `${box.width + 6}px`,
          height: `${box.height + 6}px`,
          border: '2px solid #ff4f00',
          borderRadius: '6px',
          zIndex: 100000,
          pointerEvents: 'none',
        });
        const pos = {
          left: { left: box.x - size - 8, top: box.y + box.height / 2 - size / 2 },
          right: { left: box.x + box.width + 8, top: box.y + box.height / 2 - size / 2 },
          top: { left: box.x + box.width / 2 - size / 2, top: box.y - size - 8 },
          bottom: { left: box.x + box.width / 2 - size / 2, top: box.y + box.height + 8 },
          corner: { left: box.x + box.width - size / 2, top: box.y - size / 2 },
          inside: { left: box.x + box.width - size - 12, top: box.y + 8 },
        }[at];
        const badge = document.createElement('div');
        badge.textContent = String(n);
        Object.assign(badge.style, {
          position: 'fixed',
          left: `${pos.left}px`,
          top: `${pos.top}px`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: '#ff4f00',
          color: 'white',
          font: '700 15px/26px system-ui, sans-serif',
          textAlign: 'center',
          zIndex: 100001,
          boxShadow: '0 1px 4px rgba(0,0,0,.35)',
          pointerEvents: 'none',
        });
        document.body.append(outline, badge);
      },
      { box, n, at }
    );
  }
};

/** Overlays for a result shot: the display panel closed and only the listed results drawn. */
const only = (...flags) => ({
  settingsOpen: false,
  showDeformedShape: false,
  showNormalForce: false,
  showShearForce: false,
  showBendingMoment: false,
  showReactions: false,
  ...Object.fromEntries(flags.map((f) => [f, true])),
});

/** The drawing area between the overlay buttons and the bottom bar. */
const viewerArea = async (page) => {
  const top = await page.locator('#undoRedo').boundingBox();
  const bottom = await page.locator('#bottomBar').boundingBox();
  const width = page.viewportSize().width;
  return { x: 24, y: top.y - 8, width: width - 48, height: bottom.y - top.y - 24 };
};

/** The drawn model (labels, loads and diagrams included) with a margin, inside the drawing area. */
const contentArea = async (page) => {
  const area = await viewerArea(page);
  const box = await page.evaluate(() => {
    const r = document.querySelector('.elements-layer').parentElement.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  const margin = 32;
  const x = Math.max(area.x, box.x - margin);
  const y = Math.max(area.y, box.y - margin);
  const right = Math.min(area.x + area.width, box.x + box.width + margin);
  const bottom = Math.min(area.y + area.height, box.y + box.height + margin);
  return { x, y, width: right - x, height: bottom - y };
};

/** The page under the Viewer / Settings tabs, down to the bottom bar. */
const settingsArea = async (page) => {
  const tabs = await page.locator('.v-tabs').first().boundingBox();
  const bottom = await page.locator('#bottomBar').boundingBox();
  return { x: 0, y: tabs.y + tabs.height, width: page.viewportSize().width, height: bottom.y - tabs.y - tabs.height };
};

const fitAndCrop = (name, model, flags, size = {}) => ({
  name,
  model,
  width: 1100,
  height: 820,
  ...size,
  viewer: only(...flags),
  setup: fitLoose,
  clip: contentArea,
  pad: 0,
});

/** A bottom-bar tab, tall enough for its rows. */
const table = (name, model, setup, app = {}, width = 1200) => ({
  name,
  model,
  width,
  height: 820,
  app: { bottomBarHeight: 300, ...app },
  setup,
  clip: () => '#bottomBar',
  pad: 0,
});

/** Fills the n-th text field of a dialog, counting from the top and skipping selects. */
const fillNth = async (page, n, value) => {
  await page.locator(`${dialog} .v-text-field:not(.v-select):not(.v-autocomplete) input`).nth(n).fill(String(value));
  await wait(page, 200);
};

/** A box of the page, where a crop is a fixed part of a fixed viewport rather than one element. */
const box = (x, y, width, height) => () => ({ x, y, width, height });

/** The visible box of the first match, for crops that are not one element grown evenly. */
const boxOf = async (page, selector) => {
  const found = await page.locator(selector).first().boundingBox();
  if (!found) throw new Error(`Nothing to clip: ${selector}`);
  return found;
};

/**
 * The quick start, walked from a first visit like a new user would: an empty model, a material and
 * a section from the libraries, two nodes, one element, supports, a load, the display panel, a node
 * in the middle and its results. Each a-qs shot replays it up to its own `step` and is taken there.
 */
const quickStart = async (page, step) => {
  const dlg = page.locator('.v-dialog');
  /** The support menu of the first node still free. */
  const openSupports = async () => {
    await page
      .getByRole('button', { name: t('supports.free') })
      .first()
      .click();
    await wait(page, 500);
  };
  const chooseSupport = async (label) => {
    await page
      .locator('.v-list-item')
      .filter({ has: page.getByText(label, { exact: true }) })
      .click();
    await wait(page);
  };
  /** Adds the row of a library dialog whose name contains `name` (a product name, the same in every language). */
  const fromLibrary = async (libraryTab, libraryButton, name) => {
    await bottomTab(page, libraryTab);
    await page.getByRole('button', { name: libraryButton }).click();
    await wait(page, 500);
    const row = page.locator('.v-dialog tr', { hasText: name });
    await row.scrollIntoViewIfNeeded();
    await wait(page, 300);
    await row.locator('button').first().click();
    // In the dialog: in French the toolbar's Undo is "Annuler" too
    await page.locator('.v-dialog').getByRole('button', { name: t('dialogs.common.cancel') }).click();
    await wait(page);
  };

  await page.getByText(t('welcome.skip')).click();
  await wait(page);
  await page.getByText(t('common.clearMesh')).first().click();
  await page.getByText(t('confirmation.clearMesh.materials')).click();
  await page.getByText(t('confirmation.clearMesh.crossSections')).click();
  await page.getByRole('button', { name: t('common.confirm') }).click();
  await wait(page);
  await fromLibrary(t('tabs.materials'), t('materials.material_library'), 'S235');
  await fromLibrary(t('tabs.crossSections'), t('materials.section_library'), 'IPE 200');
  if (step === 'cross-sections') return page.mouse.move(1278, 300);

  await bottomTab(page, t('tabs.nodes'));
  for (const x of [0, 6]) {
    await page
      .getByRole('button', { name: t('nodes.addNode') })
      .first()
      .click();
    await wait(page);
    await dlg.getByLabel(t('dialogs.addNode.coordinate_x')).fill(String(x));
    await dlg.getByRole('button', { name: t('dialogs.addNode.addNode') }).click();
    await wait(page);
  }
  await bottomTab(page, t('tabs.elements'));
  await page
    .getByRole('button', { name: t('elements.addElement') })
    .first()
    .click();
  await wait(page, 600);
  // Two selects carry autofocus; the start node is the one shown focused
  await page.locator('.v-dialog .v-select input').first().focus();
  if (step === 'element') return;

  await dlg.getByRole('button', { name: t('dialogs.addElement.addElement') }).click();
  await wait(page);
  await bottomTab(page, t('tabs.nodes'));
  await wait(page, 300);
  await openSupports();
  if (step === 'support-picker') return;

  await chooseSupport(t('supports.pin'));
  await openSupports();
  await chooseSupport(t('supports.roller'));
  await bottomTab(page, t('tabs.loads'));
  await page
    .getByRole('button', { name: t('loads.addElementLoad') })
    .first()
    .click();
  await wait(page, 500);
  await dlg.getByLabel('fz').fill('12');
  if (step === 'load') return;

  await dlg.getByRole('button', { name: t('dialogs.addElementLoad.addElementLoad') }).click();
  await wait(page, 600);
  await fit(page);
  // The third display toggle is the shear force, Vz(x)
  await page.locator('#viewerSettings .v-checkbox').nth(2).locator('input').click();
  await page.evaluate(() => document.activeElement?.blur());
  await page.mouse.move(400, 300);
  await wait(page, 500);
  if (step === 'display') return;

  // A node in the middle of the beam, placed by mouse on the element, which splits it in two
  await bottomTab(page, t('tabs.nodes'));
  await page
    .getByRole('button', { name: t('nodes.addNode') })
    .nth(1)
    .click();
  await wait(page);
  const beam = await rectOf(page, elementSel('1'));
  const middle = { x: beam.x + beam.width / 2, y: beam.y + beam.height / 2 };
  await page.mouse.move(middle.x - 60, middle.y);
  await page.mouse.move(middle.x, middle.y);
  await page.mouse.click(middle.x, middle.y);
  await wait(page, 600);
  await page.getByRole('button', { name: t('confirmation.splitElementAndPlaceNode.split') }).click();
  await wait(page);
  await page.keyboard.press('Escape');
  await bottomTab(page, t('tabs.results'));
  await wait(page, 300);
  await page.getByRole('button', { name: t('results.nodal_results') }).click();
  await wait(page, 600);
  await page.mouse.move(1278, 300);
};

/** The Settings tab of the app, on its Viewer settings page. */
const viewerSettings = async (page) => {
  await page
    .locator('.v-tab')
    .filter({ hasText: t('tabView.settings') })
    .first()
    .click();
  await page.getByText(t('settings.viewer_settings'), { exact: true }).first().click();
  await wait(page, 600);
};

/** The last match's box: of two overlays open at once, the one opened last. */
const lastBoxOf = async (page, selector) => {
  const found = await page.locator(selector).last().boundingBox();
  if (!found) throw new Error(`Nothing to clip: ${selector}`);
  return found;
};

/** Opens the support menu of node 1 in the Nodes tab, with no item highlighted. */
const supportMenu = async (page) => {
  await bottomTab(page, t('tabs.nodes'));
  await page.locator('#bottomBar .support-select').first().click();
  await wait(page, 600);
  await page.evaluate(() =>
    document.querySelectorAll('.v-list-item--active').forEach((item) => {
      item.classList.remove('v-list-item--active');
      item.querySelector('.v-list-item__overlay')?.remove();
    })
  );
  await page.mouse.move(5, 5);
};

/**
 * The results tab from below its tab strip down to `below` under the table, `width` wide, or wider
 * when a language's buttons or fields reach further.
 */
const resultsArea = (width, below) => async (page) => {
  const tab = await boxOf(page, '#bottomBar .v-tab[value=tab-results]');
  const { right, bottom } = await page.evaluate(() => {
    const visible = (selector) =>
      [...document.querySelectorAll('#bottomBar .v-window-item--active')]
        .flatMap((item) => [...item.querySelectorAll(selector)])
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.width > 0);
    return {
      right: Math.max(...visible('.v-input, .v-btn').map((r) => r.right)),
      bottom: Math.max(...visible('table').map((r) => r.bottom)),
    };
  });
  const y = tab.y + tab.height + 1;
  return { x: 0, y, width: Math.max(width, right + 16), height: bottom + below - y };
};

export const shots = [
  // ---------------------------------------------------------------- home & introduction
  {
    name: 'hero',
    model: 'three-hinged-frame',
    height: 760,
    viewer: { settingsOpen: false },
    setup: fit,
  },

  // ---------------------------------------------------------------- getting started
  {
    name: 'welcome',
    firstVisit: true,
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'first-beam-task',
    model: 'beam',
    width: 1100,
    height: 720,
    setup: (page) => menuItem(page, t('welcome.drawFirstBeam')),
    // The card and the toolbar button it points to
    clip: () => ['.first-beam-task', '#bottomBar .v-btn >> nth=1'],
    pad: 16,
  },
  {
    name: 'tour',
    model: 'beam',
    setup: async (page) => {
      await menuItem(page, t('welcome.showAround'));
      for (let i = 0; i < 3; i++) {
        await page
          .getByRole('button', { name: t('tour.nextButton'), exact: true })
          .first()
          .click();
        await wait(page, 400);
      }
    },
  },
  {
    name: 'qs-material',
    setup: async (page) => {
      await bottomTab(page, t('tabs.materials'));
      await toolbarButton(page, t('materials.addMaterial'));
    },
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'qs-material-library',
    setup: async (page) => {
      await bottomTab(page, t('tabs.materials'));
      await toolbarButton(page, t('materials.material_library'));
    },
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'qs-cross-section',
    setup: async (page) => {
      await bottomTab(page, t('tabs.crossSections'));
      await toolbarButton(page, t('crossSections.addCrossSection'));
    },
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'qs-node',
    model: 'beam',
    setup: (page) => toolbarButton(page, t('nodes.addNode'), 0),
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'qs-element',
    model: 'beam',
    setup: async (page) => {
      await bottomTab(page, t('tabs.elements'));
      await toolbarButton(page, t('elements.addElement'), 0);
    },
    clip: () => dialog,
    pad: 0,
  },
  table('qs-supports', 'beam', undefined, {}, 960),
  {
    name: 'qs-load',
    model: 'beam',
    setup: async (page) => {
      await bottomTab(page, t('tabs.loads'));
      await toolbarButton(page, t('loads.addElementLoad'));
      await fillNth(page, 1, 12);
    },
    clip: () => dialog,
    pad: 0,
  },
  fitAndCrop('qs-results', 'beam', ['showShearForce', 'showBendingMoment', 'showReactions', 'showDeformedShape']),
  // The quick start, each step of it walked from a first visit (see quickStart)
  {
    name: 'a-qs-cross-sections',
    firstVisit: true,
    setup: (page) => quickStart(page, 'cross-sections'),
    // The toolbar, the header and the one section added
    clip: box(0, 576, 940, 124),
    pad: 0,
  },
  {
    name: 'a-qs-element',
    firstVisit: true,
    setup: (page) => quickStart(page, 'element'),
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'a-qs-support-picker',
    firstVisit: true,
    setup: (page) => quickStart(page, 'support-picker'),
    // The support menu over the nodes table, from the left edge
    clip: box(0, 404, 720, 336),
    pad: 0,
  },
  {
    name: 'a-qs-load',
    firstVisit: true,
    setup: (page) => quickStart(page, 'load'),
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'a-qs-display',
    firstVisit: true,
    setup: (page) => quickStart(page, 'display'),
    // The display toggles with the grid behind them, at least 460 px wide from their right edge
    clip: async (page) => {
      const toggles = await boxOf(page, '#viewerSettings');
      const width = Math.max(460, toggles.width + 8);
      return { x: toggles.x + toggles.width + 4 - width, y: toggles.y - 1, width, height: toggles.height + 2 };
    },
    pad: 0,
  },
  {
    name: 'a-qs-nodal-results',
    firstVisit: true,
    setup: (page) => quickStart(page, 'nodal-results'),
    clip: box(0, 576, 640, 190),
    pad: 0,
  },

  // ---------------------------------------------------------------- user interface
  {
    name: 'ui-overview',
    model: 'three-hinged-frame',
    setup: async (page, { clipOf }) => {
      await fit(page);
      const appBarButtons = await clipOf(page, ['header .v-btn >> nth=1', 'header .v-btn >> nth=2'], 0);
      await callouts(page, [
        { selector: '#appMenu', n: 1, at: 'right' },
        { box: appBarButtons, n: 2, at: 'right' },
        { selector: '#undoRedo', n: 3, at: 'right' },
        { selector: '#viewerControls', n: 4, at: 'left' },
        { selector: '#viewerSettings', n: 5, at: 'left' },
        { selector: '#gridAndUnits', n: 6, at: 'left' },
        { selector: '#bottomBar .v-tabs', n: 7, at: 'right' },
        { selector: '#bottomBar table', n: 8, at: 'inside' },
      ]);
    },
  },
  {
    name: 'ui-app-menu',
    model: 'beam',
    setup: openMenu,
    clip: () => `${drawer} .v-list`,
    pad: 0,
  },
  {
    name: 'ui-display-settings',
    model: 'beam',
    clip: () => ['#viewerControls', '#viewerSettings'],
  },
  {
    name: 'ui-grid-units',
    model: 'beam',
    clip: () => '#gridAndUnits',
    pad: 4,
  },
  {
    name: 'ui-node-menu',
    model: 'beam',
    viewer: { settingsOpen: false },
    setup: (page) => clickNode(page, '1'),
    clip: async (page) => [await rectOf(page, nodeSel('1')), '.selection-tooltip'],
    pad: 24,
  },
  {
    name: 'ui-element-menu',
    model: 'beam',
    viewer: { settingsOpen: false },
    setup: (page) => clickElement(page, '1', 0.35),
    clip: () => '.selection-tooltip',
    pad: 24,
  },
  {
    name: 'ui-canvas-menu',
    model: 'beam',
    viewer: { settingsOpen: false },
    setup: async (page) => {
      await page.mouse.click(400, 250, { button: 'right' });
      await wait(page);
    },
    clip: () => '.mx-context-menu',
    pad: 4,
  },
  {
    name: 'ui-hover',
    model: 'beam',
    viewer: { settingsOpen: false },
    setup: (page) => hoverNode(page, '2'),
    clip: async (page) => [await rectOf(page, nodeSel('2')), '.tooltip'],
    pad: 30,
  },
  {
    name: 'ui-mechanism',
    model: 'mechanism',
    width: 1000,
    height: 760,
    viewer: { settingsOpen: false },
    setup: async (page) => {
      await fit(page);
      await wait(page, 1500);
    },
    clip: viewerArea,
    pad: 0,
  },
  {
    name: 'ui-diagnostics',
    model: 'mechanism',
    viewer: { settingsOpen: false },
    setup: async (page) => {
      await page.getByText(t('solveDiagnostics.showDetails')).first().click();
      await wait(page, 600);
    },
    clip: () => dialog,
    pad: 0,
  },

  // ---------------------------------------------------------------- nodes & supports
  {
    name: 'nodes-support-picker',
    model: 'beam',
    viewer: { settingsOpen: false },
    setup: async (page) => {
      await clickNode(page, '1');
      await page.locator('.selection-tooltip').getByText(t('nodes.defineSupports')).click();
      await wait(page, 500);
    },
    clip: async (page) => [
      await rectOf(page, nodeSel('1')),
      '.selection-tooltip',
      '.v-overlay--active .v-overlay__content',
    ],
    pad: 16,
  },
  {
    name: 'nodes-add-banner',
    model: 'beam',
    viewer: { settingsOpen: false },
    setup: async (page) => {
      await toolbarButton(page, t('nodes.addNode'), 1);
      await page.mouse.move(700, 300);
      await wait(page);
    },
    clip: () => '#addModeBanner',
    pad: 8,
  },
  // One icon per support, which the guide's tables show inline next to the support's name
  ...[
    ['b-support-free', 'supports.free'],
    ['b-support-pin', 'supports.pin'],
    ['b-support-roller', 'supports.roller'],
    ['b-support-vertical-roller', 'supports.verticalRoller'],
    ['b-support-fixed', 'supports.fixed'],
    ['b-support-slider', 'supports.slider'],
    ['b-support-vertical-slider', 'supports.verticalSlider'],
    ['b-support-rotation-only', 'supports.rotation'],
  ].map(([name, support]) => ({
    name,
    model: 'beam',
    scale: 3,
    app: { bottomBarHeight: 420 },
    viewer: { settingsOpen: false },
    setup: supportMenu,
    clip: (page) =>
      page
        .locator('.v-overlay--active .v-list-item')
        .filter({ has: page.getByText(t(support), { exact: true }) })
        .locator('.v-list-item__prepend > *')
        .first()
        .boundingBox(),
    pad: 4,
  })),

  // ---------------------------------------------------------------- elements, materials, sections
  table('elements-table', 'three-hinged-frame', (page) => bottomTab(page, t('tabs.elements'))),
  // The dashed line on each element's bottom side, nothing else drawn
  {
    name: 'p2b-element-direction',
    model: 'portal-frame',
    width: 1100,
    height: 700,
    viewer: only(),
    setup: fit,
    clip: box(340, 150, 440, 260),
    pad: 0,
  },
  {
    name: 'sections-library',
    setup: async (page) => {
      await bottomTab(page, t('tabs.crossSections'));
      await toolbarButton(page, t('materials.section_library'));
    },
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'sections-polygon',
    width: 1360,
    height: 900,
    setup: async (page) => {
      await bottomTab(page, t('tabs.crossSections'));
      await toolbarButton(page, t('crossSections.addPolygonal'));
      await choose(page, dialog, t('dialogs.polygonSection.preset'), t('dialogs.polygonSection.presets.iSection'));
      await page
        .locator(dialog)
        .getByRole('button', { name: t('dialogs.polygonSection.apply') })
        .click();
      await wait(page, 500);
    },
    clip: () => dialog,
    pad: 0,
  },

  // ---------------------------------------------------------------- loads
  fitAndCrop('loads-overview', 'loads', [], { width: 1200, height: 760 }),
  ...[
    ['loads-udl', 'loadType.udl', { 1: 12 }],
    ['loads-trapezoidal', 'loadType.trapezoidal', { 2: 4, 3: 12 }],
    ['loads-concentrated', 'loadType.concentrated', { 1: 20, 3: 2 }],
    ['loads-temperature', 'loadType.temperature', { 1: 10 }],
  ].map(([name, loadType, values]) => ({
    name,
    model: 'beam',
    setup: async (page) => {
      await bottomTab(page, t('tabs.loads'));
      await toolbarButton(page, t('loads.addElementLoad'));
      await choose(page, dialog, t('loadType.loadType'), t(loadType));
      for (const [n, value] of Object.entries(values)) await fillNth(page, Number(n), value);
    },
    clip: () => dialog,
    pad: 0,
  })),
  {
    name: 'loads-nodal',
    model: 'cantilever',
    setup: async (page) => {
      await bottomTab(page, t('tabs.loads'));
      await toolbarButton(page, t('loads.addNodalLoad'));
      await fillNth(page, 1, 10);
    },
    clip: () => dialog,
    pad: 0,
  },
  table('loads-table', 'loads', (page) => bottomTab(page, t('tabs.loads'))),

  // ---------------------------------------------------------------- results
  fitAndCrop('results-normal', 'three-hinged-frame', ['showNormalForce']),
  fitAndCrop('results-shear', 'three-hinged-frame', ['showShearForce']),
  fitAndCrop('results-moment', 'three-hinged-frame', ['showBendingMoment']),
  fitAndCrop('results-deformed', 'three-hinged-frame', ['showDeformedShape']),
  fitAndCrop('results-reactions', 'three-hinged-frame', ['showReactions']),
  // Automatic number format, so 40 kN reads as 40 and not 4 · 10¹
  table('results-nodal', 'three-hinged-frame', (page) => bottomTab(page, t('tabs.results')), { numberStyle: 'auto' }),
  table(
    'results-element',
    'three-hinged-frame',
    async (page) => {
      await bottomTab(page, t('tabs.results'));
      await toolbarButton(page, t('results.element_results'));
    },
    { numberStyle: 'auto' }
  ),
  {
    name: 'p2c-results-nodal',
    model: 'results-frame',
    width: 1200,
    app: { bottomBarHeight: 300, numberStyle: 'auto' },
    height: 820,
    setup: (page) => bottomTab(page, t('tabs.results')),
    clip: resultsArea(600, 7),
    pad: 0,
  },
  {
    name: 'p2c-results-element',
    model: 'results-frame',
    width: 1200,
    height: 820,
    app: { bottomBarHeight: 300, numberStyle: 'auto' },
    setup: async (page) => {
      await bottomTab(page, t('tabs.results'));
      await toolbarButton(page, t('results.element_results'));
    },
    clip: resultsArea(1134, 2),
    pad: 0,
  },

  // ---------------------------------------------------------------- units & settings
  {
    name: 'settings-language',
    model: 'beam',
    width: 1200,
    height: 900,
    app: { bottomBarHeight: 100 },
    setup: async (page) => {
      await page
        .locator('.v-tab')
        .filter({ hasText: t('tabView.settings') })
        .first()
        .click();
      await wait(page, 600);
    },
    clip: settingsArea,
    pad: 0,
  },
  {
    name: 'settings-viewer',
    model: 'beam',
    width: 1200,
    height: 900,
    app: { bottomBarHeight: 100 },
    setup: viewerSettings,
    clip: settingsArea,
    pad: 0,
  },
  // The viewer settings alone, tall enough for all of them
  {
    name: 'b-settings-viewer',
    model: 'beam',
    width: 1200,
    height: 1300,
    app: { bottomBarHeight: 100 },
    setup: viewerSettings,
    settle: 900,
    clip: async (page) => {
      const settings = await boxOf(page, '.viewer-settings');
      return { x: settings.x - 12, y: settings.y, width: settings.width + 24, height: settings.height + 12 };
    },
    pad: 0,
  },
  // The whole drawing area, so the axis indicator in the corner shows y up
  {
    ...fitAndCrop('settings-y-up', 'three-hinged-frame', ['showShearForce', 'showReactions'], {
      app: { axisConvention: 'y-up' },
    }),
    clip: viewerArea,
  },

  // ---------------------------------------------------------------- files & sharing
  {
    name: 'share',
    model: 'beam',
    setup: (page) =>
      page
        .locator('header .v-btn')
        .filter({ hasText: t('common.shareModel') })
        .click(),
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'c1-share',
    model: 'three-hinged-frame',
    width: 900,
    height: 820,
    setup: async (page) => {
      await page
        .locator('header .v-btn')
        .filter({ hasText: t('common.shareModel') })
        .click();
      await wait(page, 800);
      // The link as the deployed app gives it, not the address the shots were taken from
      await page.evaluate(() => {
        const link = document.querySelector('.share-textarea textarea');
        link.value = link.value.replace(location.origin, 'https://run.edubeam.app');
      });
    },
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'export-image',
    model: 'three-hinged-frame',
    height: 900,
    setup: (page) => menuItem(page, t('exportImage.title')),
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'examples',
    model: 'beam',
    height: 900,
    setup: (page) => menuItem(page, t('examples.title')),
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'recent',
    model: 'beam',
    setup: async (page) => {
      // Open two more models over the beam so the list has something in it.
      for (const model of ['truss', 'three-hinged-frame']) {
        await page.setInputFiles('input[type=file]', new URL(`./models/${model}.json`, import.meta.url).pathname);
        await wait(page, 500);
      }
      await menuItem(page, t('recentStructures.title'));
    },
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'viewer-mode',
    url: '?viewer=1',
    model: 'three-hinged-frame',
    width: 960,
    height: 560,
    setup: fit,
  },

  // ---------------------------------------------------------------- tutorials
  fitAndCrop('tut-frame-moment', 'three-hinged-frame', ['showBendingMoment', 'showReactions']),
  fitAndCrop('tut-frame-normal', 'three-hinged-frame', ['showNormalForce']),
  fitAndCrop('tut-truss-model', 'truss', [], { width: 1200 }),
  fitAndCrop('tut-truss', 'truss', ['showNormalForce', 'showReactions'], { width: 1200 }),
  // The models of the tutorials' "Open in EduBeam" links
  {
    name: 'p2t-frame-elements-table',
    model: 'tutorial-frame',
    width: 1000,
    height: 1100,
    setup: (page) => bottomTab(page, t('tabs.elements')),
    // The tab strip, the toolbar and the first three elements
    clip: async (page) => {
      const bar = await boxOf(page, '#bottomBar');
      return { x: 0, y: bar.y + 2, width: 1000, height: 210 };
    },
    pad: 0,
  },
  {
    name: 'p2t-node-supports-angle',
    model: 'inclined-beam',
    width: 1100,
    height: 800,
    viewer: { settingsOpen: false },
    setup: async (page) => {
      await fit(page);
      await hoverNode(page, '2');
      await clickNode(page, '2');
      await page.locator('.selection-tooltip').getByText(t('nodes.defineSupports')).click();
      await wait(page, 600);
      await page.getByRole('textbox', { name: t('nodes.lcsAngle') }).fill('-36.87');
    },
    // Both menus, with a little more room above than below
    clip: async (page, { clipOf }) => {
      const menus = await clipOf(page, [
        await lastBoxOf(page, '.selection-tooltip'),
        await lastBoxOf(page, '.v-overlay--active .v-overlay__content'),
      ]);
      return { x: menus.x - 6, y: menus.y - 6, width: menus.width + 13, height: menus.height + 10 };
    },
    pad: 0,
  },
  {
    name: 'p2t-prescribe-displacement',
    model: 'continuous-beam',
    width: 1100,
    height: 800,
    setup: async (page) => {
      await fit(page);
      await hoverNode(page, '2');
      await clickNode(page, '2');
      await page.getByText(t('loads.addPrescribedDisplacement')).last().click();
      await wait(page, 800);
      await page.getByRole('textbox', { name: 'Dz' }).fill('0.01');
    },
    clip: () => dialog,
    pad: 0,
  },
];
