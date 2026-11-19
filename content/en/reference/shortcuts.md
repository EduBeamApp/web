---
description: "Every EduBeam keyboard shortcut, mouse action and touch gesture: undo, save, open, export image, copy and paste, fit, zoom, select and pan."
source: site
---

# Keyboard, mouse & touch

EduBeam works with a keyboard and mouse, a trackpad, or a finger. This page lists every shortcut and gesture. On a Mac, use <kbd>Cmd</kbd> wherever <kbd>Ctrl</kbd> is shown; the app's own menus show ⌘ there.

## Keyboard

The drawing shortcuts (<kbd>F</kbd>, <kbd>C</kbd>, <kbd>G</kbd>, <kbd>S</kbd>, <kbd>Delete</kbd> and <kbd>Ctrl</kbd>+<kbd>A</kbd>, <kbd>C</kbd>, <kbd>V</kbd>) do nothing while a text field has focus, so typing an `f` or an `s` into a field never fires them. Click the drawing first.

### Files and history {#files-and-history}

| Shortcut | Action |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> | Undo the last change to the model |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | Redo |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Save project (downloads `project.json`) |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | Open project |
| <kbd>Ctrl</kbd>+<kbd>P</kbd> | Export image |

Undo also takes back clearing the model, opening a file, a link or an example, and restoring a recent structure. While you are still typing in a table cell, <kbd>Ctrl</kbd>+<kbd>Z</kbd> takes back the typing; once the cell is confirmed, it undoes the change to the model. In a dialog's fields it always undoes the typing.

### Drawing {#drawing}

| Shortcut | Action |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>A</kbd> | Select everything |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Copy the selected nodes, elements and loads |
| <kbd>Ctrl</kbd>+<kbd>V</kbd> | Paste. A ghost of the copy follows the pointer: click to place it, or type an offset Δx, Δz in the banner and press **Paste** or <kbd>Enter</kbd> |
| <kbd>Delete</kbd> | Delete the selection (on a Mac laptop, <kbd>Fn</kbd>+<kbd>Delete</kbd>) |
| <kbd>Esc</kbd> | Leave the current mode (adding nodes, elements or dimensions, pasting, picking a window for an image) and clear the selection; also closes the ☰ menu and ends the tour |
| <kbd>F</kbd> | Fit content to screen |
| <kbd>C</kbd> | Center content |
| <kbd>G</kbd> | Toggle the grid |
| <kbd>S</kbd> | Toggle snap to grid |
| <kbd>Ctrl</kbd>+<kbd>+</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Zoom the drawing in / out about its centre |

In EduBeam, <kbd>Ctrl</kbd>+<kbd>+</kbd> and <kbd>Ctrl</kbd>+<kbd>-</kbd> zoom the drawing, never the whole interface as they do on other sites. They work with any keyboard layout: the keys marked + and −, wherever your layout has them, the two left of <kbd>Backspace</kbd> on a US keyboard, and the + and − of the numeric keypad.

### Tables and dialogs {#tables-and-dialogs}

| Shortcut | Action |
| --- | --- |
| <kbd>Enter</kbd> | In a table cell: confirm the value. In a dialog's text field: confirm the dialog, as its main button does |
| <kbd>Esc</kbd> | In a table cell: leave it, keeping the value. In a dialog: close it without saving |
| <kbd>Tab</kbd> | Move to the next field; a table cell keeps what you typed |

Number fields accept arithmetic as you would work it out: `6/2`, `3*1.5`, `2^3`, `(4+2)/3`, and `1e3` or a decimal comma.

## Mouse

| Action | Result |
| --- | --- |
| Click | Select a node, element, load or dimension line and open its panel |
| Drag on empty canvas | Selection rectangle |
| Drag a node | Move it; it snaps to the grid when snapping is on |
| Click while adding | Place a node, or start or continue an element polyline |
| Double-click a load | Edit the load (also a prescribed displacement) |
| Right-click | Canvas menu: Add node, Add element, Add dimension, Dimension element (over an element), Edit, Copy, Paste, Delete |
| <kbd>Ctrl</kbd> + **Add node** or **Add element** in the canvas menu | Place with the mouse instead of opening a dialog |
| Middle- or right-button drag | Pan. Choose the button in **Settings → Controls & Shortcuts → Pan using** |
| Wheel | Zoom towards the pointer |
| Point at an object | Tooltip with its displacements, properties or load values |

On a trackpad, pinching and two-finger scrolling both zoom. To pan, click and drag with two fingers, which is a right-button drag.

## Touch

| Gesture | Result |
| --- | --- |
| Tap | Select an object and show its details and actions |
| Tap while adding | Place a node or continue an element |
| Press a node and drag | Move the node |
| One-finger drag elsewhere | Pan |
| Pinch | Zoom |
| Press and hold the canvas | Canvas menu |
| **Box select** button (top right), then drag | Selection rectangle; the canvas menu, with Copy and Delete, opens where you lift your finger |

While you add nodes, elements or dimensions, paste, or pick a window for an image, a banner at the top of the drawing names the mode and has a **Cancel** button. Without an <kbd>Esc</kbd> key, that is how you leave the mode on a touch screen.

## Object panels

Clicking or tapping an object opens a panel next to it with its details and these actions:

| Object | Actions |
| --- | --- |
| Node | Add load · Node supports (support symbol, Dx, Dz, Ry) · Nodal LCS angle · Prescribe displacement (on a supported node) · Delete |
| Element | Edit element (end nodes and hinges, material, cross section) · Add load · Stiffness matrix · Delete |
| Nodal or element load | Edit load · Delete |
| Dimension line | Edit · Flip dimension · Delete |

[User interface](/essentials/user-interface) is a tour of the screen, and [Controls & Shortcuts](/essentials/units-settings#controls-shortcuts) in the settings chooses the pan button.
