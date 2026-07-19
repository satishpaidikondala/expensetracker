# Improvement Roadmap

## Phase 1 — Charts & Visuals
| Item | Effort | Details |
|------|--------|---------|
| Monthly bar chart | ~1h | Recharts `BarChart` using `GET /expenses/summary/monthly` |
| Category pie chart | ~1h | Recharts `PieChart` using `GET /expenses/summary/by-category` |
| Weekly spending view | ~2-3h | New backend endpoint or frontend client-side grouping by ISO week |

## Phase 2 — Data Table UX
| Item | Effort | Details |
|------|--------|---------|
| Inline edit | ~2h | Click a row to edit amount/category/date in-place, PUT on blur |
| CSV export | ~15m | Button that builds a CSV blob from the expenses array |
| Filter by date range | ~1h | Two date inputs above table with client-side filter |

## Phase 3 — Testing
| Item | Effort | Details |
|------|--------|---------|
| Backend smoke test | ~30m | `@WebMvcTest(ExpenseController.class)` — create, list, delete |
| Frontend component test | ~1h | Vitest + React Testing Library for ExpenseForm and ExpenseTable |

## Phase 4 — Quality of Life
| Item | Effort | Details |
|------|--------|---------|
| Form inline validation | ~30m | Red border + message on empty/invalid fields before submit |
| Root dev command | ~15m | `concurrently` to run backend + frontend with one `npm start` |
| Pin JDK 21 for Maven | ~5m | Add `jvm.config` or `.java-version` so `mvnw` auto-picks JDK 21 |
| Gate `show-sql` behind profile | ~10m | Move to `application-dev.properties` with `spring.profiles.active` |
| Auth (optional) | ~1-2d | JWT with Spring Security (only if this goes beyond local dev) |

## Backend Fixes Needed
| Item | Effort | Details |
|------|--------|---------|
| `monthly` endpoint year param | ~15m | Accept optional year query param, default to current year |
| Remove explicit H2Dialect | ~2m | Warn in logs says it's auto-detected (low priority) |
