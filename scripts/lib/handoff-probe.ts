import assert from "node:assert/strict"
import type { Page } from "puppeteer-core"

/** Observe actual child layout at the ready signal, then across the following painted frames. */
export async function observeHandoffs(page: Page) {
  await page.evaluateOnNewDocument(`(() => {
    if (top !== self) return;
    window.__handoffs = [];
    addEventListener('message', (event) => {
      if (event.origin !== location.origin || event.data?.type !== 'design-infra-preview' || event.data.status !== 'ready') return;
      const source = event.source;
      const frame = source?.frameElement;
      const card = frame?.closest('[data-home-example]');
      if (!card || !['smoothui/progressive-blur', 'smoothui/card-swipe-deck'].includes(card.dataset.homeExample)) return;
      const target = source.document.querySelector('[aria-label="Scrollable activity example"], [aria-label="Swipeable card deck"]');
      if (!target) return;
      const record = { id: card.dataset.homeExample, samples: [], done: false };
      window.__handoffs.push(record);
      const capture = () => {
        if (!frame.isConnected) { record.done = true; return; }
        const content = target.getBoundingClientRect();
        const outer = card.getBoundingClientRect();
        record.samples.push({ fonts: source.document.fonts.status, rect: [content.x, content.y, content.width, content.height, outer.width, outer.height, outer.top + scrollY] });
        if (record.samples.length < 20) requestAnimationFrame(capture);
        else record.done = true;
      };
      capture();
    });
  })()`)
}

export async function assertStableHandoff(page: Page, id: string) {
  await page.waitForFunction((id) => {
    const records = (window as unknown as { __handoffs: { id: string; done: boolean }[] }).__handoffs
    return records.filter((record) => record.id === id).at(-1)?.done
  }, {}, id)
  const record = await page.evaluate((id) => {
    const records = (window as unknown as { __handoffs: { id: string; samples: { fonts: string; rect: number[] }[] }[] }).__handoffs
    return records.filter((record) => record.id === id).at(-1)!
  }, id)
  assert.equal(record.samples.length, 20, `${id}: observe the complete handoff`)
  const first = record.samples[0].rect
  assert.ok(record.samples.every((sample) => sample.fonts === "loaded" && sample.rect.every((value, i) => Math.abs(value - first[i]) < 1)), `${id}: content and outer card must stay in position after reveal: ${JSON.stringify(record.samples)}`)
}
