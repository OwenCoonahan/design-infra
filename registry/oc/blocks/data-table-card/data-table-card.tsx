"use client"

import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, ListFilter, Search } from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

type Row = Record<string, unknown>
type BadgeVariant = "default" | "secondary" | "outline" | "destructive"

export type DataTableColumn<T extends Row> = {
  key: keyof T & string
  header: string
  align?: "left" | "right"
  sortable?: boolean
  /** Render the raw value as a badge; map values → badge variants. Server-safe alternative to `cell`. */
  badge?: Partial<Record<string, BadgeVariant>> | true
  /** Custom renderer (client pages only — functions can't cross the server/client boundary). */
  cell?: (row: T) => React.ReactNode
  className?: string
}

/**
 * Card-wrapped shadcn table with a toolbar: search, one faceted filter, action slot,
 * sortable columns, row selection and client-side pagination. Good up to a few thousand
 * rows; beyond that, swap the internals for TanStack Table + server pagination.
 */
export function DataTableCard<T extends Row>({
  title,
  description,
  columns,
  rows,
  rowKey,
  searchKeys,
  searchPlaceholder = "Search…",
  filter,
  actions,
  selectable = true,
  pageSize = 8,
  emptyMessage = "No results.",
  className,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  columns: DataTableColumn<T>[]
  rows: T[]
  /** Unique id field. */
  rowKey: keyof T & string
  /** Fields matched by the search box. Omit to hide search. */
  searchKeys?: (keyof T & string)[]
  searchPlaceholder?: string
  /** One faceted filter (e.g. status). Options default to the distinct values in `rows`. */
  filter?: { key: keyof T & string; label: string; options?: string[] }
  /** Toolbar buttons (Export, New…). */
  actions?: React.ReactNode
  selectable?: boolean
  pageSize?: number
  emptyMessage?: React.ReactNode
  className?: string
}) {
  const [query, setQuery] = React.useState("")
  const [facets, setFacets] = React.useState<string[]>([])
  const [sort, setSort] = React.useState<{ key: string; dir: "asc" | "desc" } | null>(null)
  const [page, setPage] = React.useState(0)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  const facetOptions = React.useMemo(
    () => (filter ? (filter.options ?? [...new Set(rows.map((r) => String(r[filter.key])))]) : []),
    [filter, rows]
  )

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    let out = rows.filter(
      (r) =>
        (!q ||
          (searchKeys ?? []).some((k) =>
            String(r[k] ?? "")
              .toLowerCase()
              .includes(q)
          )) &&
        (!filter || !facets.length || facets.includes(String(r[filter.key])))
    )
    if (sort) {
      out = [...out].sort((a, b) => {
        const av = a[sort.key]
        const bv = b[sort.key]
        const cmp =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true })
        return sort.dir === "asc" ? cmp : -cmp
      })
    }
    return out
  }, [rows, query, searchKeys, filter, facets, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, pages - 1)
  const visible = filtered.slice(current * pageSize, current * pageSize + pageSize)
  const id = (r: T) => String(r[rowKey])
  const allVisibleSelected = visible.length > 0 && visible.every((r) => selected.has(id(r)))
  const someVisibleSelected = visible.some((r) => selected.has(id(r)))

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null))

  const renderCell = (col: DataTableColumn<T>, row: T) => {
    if (col.cell) return col.cell(row)
    const v = row[col.key]
    if (col.badge) {
      const variant = col.badge === true ? "secondary" : (col.badge[String(v)] ?? "secondary")
      return <Badge variant={variant}>{String(v)}</Badge>
    }
    return v === null || v === undefined ? "—" : String(v)
  }

  return (
    <section className={cn("flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground", className)}>
      {title || description ? (
        <header className="flex flex-col gap-1 px-5 pt-5">
          {title ? <h2 className="font-heading text-lg font-headline tracking-tight">{title}</h2> : null}
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </header>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 px-5 py-4">
        {searchKeys?.length ? (
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(0)
              }}
              placeholder={searchPlaceholder}
              aria-label="Search rows"
              className="pl-8"
            />
          </div>
        ) : null}
        {filter ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-dashed">
                <ListFilter />
                {filter.label}
                {facets.length ? (
                  <Badge variant="secondary" className="ml-1 tabular-nums">
                    {facets.length}
                  </Badge>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {facetOptions.map((o) => (
                <DropdownMenuCheckboxItem
                  key={o}
                  checked={facets.includes(o)}
                  onCheckedChange={(on) => {
                    setFacets((f) => (on ? [...f, o] : f.filter((x) => x !== o)))
                    setPage(0)
                  }}
                  onSelect={(e) => e.preventDefault()}
                >
                  {o}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        {selected.size ? (
          <span className="text-sm text-muted-foreground tabular-nums">{selected.size} selected</span>
        ) : null}
        {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
      </div>

      <div className="border-y">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              {selectable ? (
                <TableHead className="w-10 pl-5">
                  <Checkbox
                    aria-label="Select page"
                    checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                    onCheckedChange={(on) =>
                      setSelected((s) => {
                        const next = new Set(s)
                        for (const r of visible) {
                          if (on) next.add(id(r))
                          else next.delete(id(r))
                        }
                        return next
                      })
                    }
                  />
                </TableHead>
              ) : null}
              {columns.map((col, i) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "text-muted-foreground",
                    col.align === "right" && "text-right",
                    !selectable && i === 0 && "pl-5",
                    i === columns.length - 1 && "pr-5"
                  )}
                  aria-sort={sort?.key === col.key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={cn(
                        "-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-foreground",
                        col.align === "right" && "flex-row-reverse"
                      )}
                    >
                      {col.header}
                      {sort?.key === col.key ? (
                        sort.dir === "asc" ? (
                          <ArrowUp className="size-3.5" />
                        ) : (
                          <ArrowDown className="size-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown className="size-3.5 opacity-50" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length ? (
              visible.map((row) => {
                const isSel = selected.has(id(row))
                return (
                  <TableRow key={id(row)} data-state={isSel ? "selected" : undefined}>
                    {selectable ? (
                      <TableCell className="pl-5">
                        <Checkbox
                          aria-label="Select row"
                          checked={isSel}
                          onCheckedChange={(on) =>
                            setSelected((s) => {
                              const next = new Set(s)
                              if (on) next.add(id(row))
                              else next.delete(id(row))
                              return next
                            })
                          }
                        />
                      </TableCell>
                    ) : null}
                    {columns.map((col, i) => (
                      <TableCell
                        key={col.key}
                        className={cn(
                          "py-3",
                          col.align === "right" && "text-right tabular-nums",
                          !selectable && i === 0 && "pl-5",
                          i === columns.length - 1 && "pr-5",
                          col.className
                        )}
                      >
                        {renderCell(col, row)}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-28 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <footer className="flex items-center justify-between gap-4 px-5 py-3 text-sm text-muted-foreground">
        <span className="tabular-nums">
          {filtered.length
            ? `${current * pageSize + 1}–${Math.min(filtered.length, (current + 1) * pageSize)} of ${filtered.length}`
            : "0 rows"}
        </span>
        <div className="flex items-center gap-2">
          <span className="hidden tabular-nums sm:inline">
            Page {current + 1} of {pages}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={current >= pages - 1}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </footer>
    </section>
  )
}
