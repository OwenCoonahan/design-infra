"use client"

import { ChevronsUpDown, LogOut } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type AppShellNavItem = {
  title: string
  href: string
  /** Pass an element (`<Home />`), not a component, so server pages can render the shell. */
  icon?: React.ReactNode
  active?: boolean
  badge?: React.ReactNode
}
export type AppShellNavGroup = { label?: string; items: AppShellNavItem[] }
export type AppShellUser = { name: string; email?: string; avatar?: string }
export type AppShellMenuItem = { label: string; href: string; icon?: React.ReactNode }

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

/**
 * Product app frame: collapsible shadcn sidebar (brand, grouped nav, user menu) + a
 * header bar (sidebar toggle, breadcrumbs, action slot) + the page content.
 * Collapses to icons on desktop (⌘B) and to a sheet on mobile.
 */
export function AppShell({
  brand,
  nav,
  user,
  userMenu = [],
  onLogOut,
  breadcrumbs = [],
  headerActions,
  sidebarFooter,
  defaultOpen = true,
  className,
  contentClassName,
  children,
}: {
  brand: { name: string; logo?: React.ReactNode; subtitle?: string; href?: string }
  nav: AppShellNavGroup[]
  user?: AppShellUser
  /** Items in the user dropdown (Account, Billing…). A "Log out" item is always appended. */
  userMenu?: AppShellMenuItem[]
  onLogOut?: () => void
  breadcrumbs?: { label: string; href?: string }[]
  /** Right side of the header: search, buttons, avatar… */
  headerActions?: React.ReactNode
  /** Extra content above the user menu (upgrade card, usage meter…). */
  sidebarFooter?: React.ReactNode
  defaultOpen?: boolean
  /** Applied to the SidebarProvider wrapper (e.g. `h-svh` for full-height chat layouts). */
  className?: string
  /** Applied to the content area below the header. Defaults to padded, scrolling page. */
  contentClassName?: string
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen} className={className}>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href={brand.href ?? "/"}>
                    <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground [&_svg]:size-4">
                      {brand.logo ?? (
                        <span className="font-heading text-sm font-headline">{brand.name.slice(0, 1)}</span>
                      )}
                    </span>
                    <span className="grid flex-1 text-left leading-tight">
                      <span className="truncate font-heading font-headline">{brand.name}</span>
                      {brand.subtitle ? (
                        <span className="truncate text-xs text-sidebar-foreground/70">{brand.subtitle}</span>
                      ) : null}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            {nav.map((group, gi) => (
              <SidebarGroup key={group.label ?? gi}>
                {group.label ? <SidebarGroupLabel>{group.label}</SidebarGroupLabel> : null}
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href + item.title}>
                      <SidebarMenuButton asChild isActive={item.active} tooltip={item.title}>
                        <Link href={item.href} aria-current={item.active ? "page" : undefined}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge !== undefined ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter>
            {sidebarFooter ? <div className="group-data-[collapsible=icon]:hidden">{sidebarFooter}</div> : null}
            {user ? (
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      >
                        <Avatar className="size-8 rounded-lg after:rounded-lg">
                          {user.avatar ? <AvatarImage src={user.avatar} alt="" className="rounded-lg" /> : null}
                          <AvatarFallback className="rounded-lg text-xs">{initials(user.name)}</AvatarFallback>
                        </Avatar>
                        <span className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">{user.name}</span>
                          {user.email ? (
                            <span className="truncate text-xs text-sidebar-foreground/70">{user.email}</span>
                          ) : null}
                        </span>
                        <ChevronsUpDown className="ml-auto size-4" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="top"
                      align="start"
                      className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="text-sm text-foreground">{user.name}</div>
                        {user.email ? <div className="text-xs text-muted-foreground">{user.email}</div> : null}
                      </DropdownMenuLabel>
                      {userMenu.length ? (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            {userMenu.map((m) => (
                              <DropdownMenuItem key={m.label} asChild>
                                <Link href={m.href}>
                                  {m.icon}
                                  {m.label}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </>
                      ) : null}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={onLogOut}>
                        <LogOut />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            ) : null}
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="min-w-0">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger className="-ml-1" />
            {breadcrumbs.length ? (
              <>
                <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-center" />
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((b, i) => {
                      const last = i === breadcrumbs.length - 1
                      return (
                        <React.Fragment key={b.label}>
                          <BreadcrumbItem className={cn(!last && "hidden md:block")}>
                            {last || !b.href ? (
                              <BreadcrumbPage>{b.label}</BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink asChild>
                                <Link href={b.href}>{b.label}</Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {!last ? <BreadcrumbSeparator className="hidden md:block" /> : null}
                        </React.Fragment>
                      )
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              </>
            ) : null}
            {headerActions ? <div className="ml-auto flex items-center gap-2">{headerActions}</div> : null}
          </header>
          <div className={cn("flex flex-1 flex-col gap-6 p-4 md:p-6", contentClassName)}>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
