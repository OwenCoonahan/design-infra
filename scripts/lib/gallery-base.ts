import { BASE_PATH } from "../../lib/config"

/** --base accepts either a host or an explicit app URL, including a subpath. */
export function galleryBase(input: string) {
  const url = new URL(input)
  return `${url.origin}${url.pathname.replace(/\/$/, "") || BASE_PATH}`
}
