# Social Content Dashboard – Execution Plan

This checklist is for the SWE implementing the UI sketched in the wireframe.  
Follow the steps in order. Mark a task complete by changing `[ ]` to `[x]`.

---

## 1. Project Preparation
- [x] **Sync repository** – `git pull origin main`.
- [x] **Install dependencies** – `pnpm install` / `npm install`.
- [x] **Add shadcn/ui CLI** – `npx shadcn-ui@latest init` (choose *Next.js, TypeScript, Tailwind*).
- [x] **Install icon library** – `pnpm add lucide-react` (or `react-icons`).
- [x] **Verify Tailwind config** – ensure `tailwind.config.ts` paths include `src/**/*.{ts,tsx}`.

## 2. Design Tokens & Constants
- [x] Create `src/lib/constants/platforms.ts` exporting an array of platform metadata `{ id, label, icon }`.
- [x] Add any required color or spacing tokens to Tailwind config.

## 3. Core Components (individually testable)
Each component lives in `src/components/` and exports its own Storybook story + Jest tests.

### 3.1 PlatformSelector
- [x] Build using shadcn `ToggleGroup`/`Tabs` with icons from `react-icons`.
- [x] Accept `value`, `onValueChange` props.
- [x] Include ARIA labels for accessibility.
- [ ] Tests: renders all platforms, fires `onValueChange`.

### 3.2 ScriptEditor
- [x] Implement shadcn `Textarea` sized as per mockup.
- [x] Support controlled + uncontrolled usage.
- [ ] Tests: type, resize, accessibility label.

### 3.3 ThumbnailUploader
- [x] Re-use shadcn `FileUpload` pattern or write custom dropzone (accept images only).
- [x] Preview thumbnail, expose `onFileSelect`.
- [ ] Tests: accept/deny files, preview appears.

### 3.4 VideoUploader
- [x] Similar upload component accepting video/* MIME types.
- [x] Show progress bar (shadcn `Progress`).
- [ ] Tests: upload triggers progress callback, handles cancel.

## 4. Page Composition
- [x] Create `src/app/dashboard/page.tsx`.
- [x] Compose `PlatformSelector`, `ScriptEditor`, `ThumbnailUploader`, `VideoUploader` inside responsive grid similar to sketch.
- [x] Use Tailwind grid classes (`grid-cols-3`, etc.) + `@container` queries for mobile.

## 5. Routing & Navigation
- [x] Add link from `/` landing page to `/dashboard`.
- [ ] Protect route if authentication is planned (placeholder).

## 6. End-to-End UX
- [x] Hook component callbacks into a temporary context/provider (`ContentDraftProvider`) to persist form state across refresh (optional localStorage).
- [x] Validate thumbnail + video size/ratio, display errors with shadcn `Alert`.

## 7. Testing & Quality
- [ ] **Unit tests** – Jest + React Testing Library for each component.
- [ ] **Integration test** – Cypress/Playwright flow covering draft creation.
- [ ] **Storybook** – `yarn storybook` stories for visual QA.
- [ ] **Lint & Format** – `pnpm lint && pnpm format` should pass.

## 8. Documentation
- [ ] Update `README.md` with local dev instructions.
- [ ] Add GIF/screenshots of the finished dashboard.

## 9. Review & Merge
- [ ] Submit PR with descriptive checklist.
- [ ] Request design & QA review.
- [ ] Squash & merge once approvals pass.

---

### How to check off tasks
Replace the empty space inside the brackets with an `x` like so: `[x]`.
> Example:  
> - [x] Install dependencies

Happy hacking! 🚀 