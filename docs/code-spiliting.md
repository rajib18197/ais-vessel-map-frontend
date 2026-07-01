# Performance: splitting the bundle so the map doesn't block the page

## The problem

Here's a question worth asking about any web app: what does the very first thing the user sees actually _need_?

For this app, the honest answer is: not much. A sidebar. A header. Maybe a loading state while the vessel feed connects. The map is the headline feature, sure — but it's not the _first_ thing anyone needs, because there's nothing to show on it until vessel data has arrived anyway.

And yet, before this change, the browser had to download one single 170 KB JavaScript file before it could render _anything at all_ — including that simple sidebar. Buried inside that file was Leaflet, the mapping library, which on its own accounts for roughly 54 KB of that total. The user was waiting on the map library to load before they could see a screen that didn't even have a map on it yet.

That's the kind of thing that's invisible until you go looking for it. The app worked. It wasn't slow, exactly. But there was a real, measurable gap between "what loads" and "what's actually needed first" — and that gap was costing real users real milliseconds, every single visit.

## What I did about it

The fix has two parts, and they work together.

**First, I told the bundler to stop treating every dependency as equally urgent.** Vite (via Rolldown, its newer Rust-based bundler) lets you define explicit groups for code splitting. I split things into: the app's own code plus React, a separate file just for Leaflet and its React bindings, and two more small files for TanStack Query and Zod. Instead of one undifferentiated blob, the build now produces several purpose-built files.

**Second — and this is the part that actually matters — I changed _when_ the map code gets requested.** Using React's `lazy()` and `Suspense`, the Leaflet chunk isn't fetched at all until the moment the map component is about to mount. The browser doesn't even know that file exists until it needs it. While that's loading, the rest of the page — the part that doesn't depend on the map — has already rendered.

I didn't stop at making the change; I verified it. I used `rollup-plugin-visualizer` to generate an actual treemap of what was inside the original bundle, which is how I confirmed Leaflet was the single biggest deferrable chunk in the first place rather than guessing. After the change, I checked the build output again to confirm the split landed exactly where it should — that Leaflet really had moved out of the critical path, and that nothing silently broke along the way.

## What changed, in numbers

|                                           | Before              | After              |
| ----------------------------------------- | ------------------- | ------------------ |
| What the browser needs before first paint | 170.56 KB (gzipped) | 91.36 KB (gzipped) |
| Reduction                                 | —                   | **46%**            |

That 91.36 KB now contains exactly what's needed to render the initial UI — nothing more. The map library, plus the smaller libraries, load in parallel in their own files immediately after, completely invisibly to the user.

## Why this is worth doing

A 46% smaller first-paint bundle doesn't mean the app does less — it means the app stops making people wait for things they don't need yet. The sidebar, header, and layout appear sooner. The map still shows up moments later, and in practice that delay is imperceptible — but it's no longer _blocking_ anything.

This is also, I think, a useful habit more broadly: not every dependency deserves a front-row seat in the critical path. The right question isn't "how do I make the bundle smaller" in the abstract — it's "what does the first screen actually need, and what can wait?" Once you frame it that way, the fix tends to fall out pretty naturally.

![Before and after diagram of the bundle splitting](/public/bundle-splitting-diagram.svg)
