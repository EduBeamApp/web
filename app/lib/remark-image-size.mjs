/**
 * Gives every Markdown image its pixel size as `width` and `height`, read from the file in
 * `public/`. Without them a screenshot takes no room until it loads and then pushes everything
 * below it down: a link to `#a-heading` lands where the heading was before the images above it
 * arrived. With them the browser keeps each image's box from the start.
 *
 * Only the file's header is read (WebP and PNG, which is all the pages use). An image that is
 * missing or in another format is left as it was, and a size the page sets itself is kept.
 */
import { closeSync, openSync, readSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const PUBLIC = fileURLToPath(new URL('../../public/', import.meta.url))

/** @type {Map<string, { width: number, height: number } | null>} */
const cache = new Map()

/** @param {Buffer} b @returns {{ width: number, height: number } | null} */
const sizeOf = (b) => {
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16)
    if (chunk === 'VP8X') return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 }
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21)
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
    }
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff }
  }
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) }
  return null
}

/** @param {string} src */
const read = (src) => {
  if (!cache.has(src)) {
    let size = null
    try {
      const fd = openSync(PUBLIC + decodeURIComponent(src.replace(/^\//, '').split(/[?#]/)[0]), 'r')
      const head = Buffer.alloc(32)
      readSync(fd, head, 0, 32, 0)
      closeSync(fd)
      size = sizeOf(head)
    } catch {
      size = null
    }
    cache.set(src, size)
  }
  return cache.get(src)
}

/** @param {any} node @param {(node: any) => void} visit */
const walk = (node, visit) => {
  visit(node)
  node.children?.forEach((child) => walk(child, visit))
}

export default () => (tree) =>
  walk(tree, (node) => {
    if (node.type !== 'image' || !node.url?.startsWith('/')) return
    const size = read(node.url)
    if (!size) return
    node.data ??= {}
    // A size the page gives wins (`{width="34"}`): only the missing side is filled in, in proportion
    const given = { ...node.attributes, ...node.data.hProperties }
    const w = Number(given.width) || undefined
    const h = Number(given.height) || undefined
    const width = w ?? (h ? Math.round((h * size.width) / size.height) : size.width)
    const height = h ?? (w ? Math.round((w * size.height) / size.width) : size.height)
    node.data.hProperties = { ...node.data.hProperties, width, height }
  })
