- ## 1. Setup Supabase Client (Frontend)**
  - [x] Install `@supabase/supabase-js` in the Next.js workspace if not already present.
  - [x] Create `src/lib/supabaseClient.ts` that initialises the Supabase client with `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - [x] Unit-test the client initialisation.

- ## 2. Video Upload Flow**
  - [x] Refactor `VideoUploader` to use the Supabase client:
    - [x] On file selection, upload the file to `videos/` bucket path with a unique filename (e.g. uuid + original extension).
    - [x] Replace the current simulated progress with real upload progress from Supabase.
    - [x] Return the public URL of the uploaded video via `onFileSelect` callback.
  - [x] Allow cancelling an in-progress upload (abort & remove partially-uploaded file).
  - [ ] E2E test with Playwright: select a small sample video → verify it appears in Supabase storage and UI shows 100 %.

- ## 3. Transcript Retrieval**
  - [x] Create React hook `useTranscription(videoUrl)` inside `src/hooks/useTranscription.ts`:
    - [x] Call backend POST `/api/v1/transcribe` with payload `{ audio_url: videoUrl }`.
    - [x] Manage loading, success, error states and return the transcript string.
  - [x] Integrate the hook in the page:
    - [x] After upload completes, automatically request transcription.
    - [x] Show a skeleton/loader while waiting.
    - [x] Once received, populate `ScriptEditor` (read-only by default, with an "Edit" toggle).
  - [x] Unit-test the hook with mocked fetch.

- ## 4. Platform Selection UI**
  - [x] Enhance `PlatformSelector` to support multi-select (toggle-group `type="multiple"`).
  - [x] Keep single-select behaviour for now but store value as array internally for future expansion.

- ## 5. Content Generation Flow**
  - [ ] Add "Generate Content" button component.
  - [ ] On click, for each selected platform:
    - [ ] POST to `/api/v1/generate/{platform}` with body `{ transcript }`.
    - [ ] Collect responses (title, tags, validation info).
  - [ ] Display results in a new `GeneratedContentCard` component showing:
    - [ ] Title text with copy button.
    - [ ] Tag list with copy-all button.
    - [ ] Validation status & quality score (green if valid, yellow warning, red error).
  - [ ] Parallelise requests with `Promise.allSettled` & show per-platform loaders.
  - [ ] Integration test: mock backend, verify UI renders cards for all platforms.

- ## 6. Content Validation UI (Optional Stretch)**
  - [ ] Add "Validate" button on each generated card to refetch `/api/v1/validate/{platform}` with the current content.
  - [ ] Surface suggestions & issues returned by backend.

- ## 7. Global Error & State Handling**
  - [ ] Setup React Context or Zustand store to keep track of:
    - [ ] Uploaded video URL
    - [ ] Transcript data
    - [ ] Selected platforms
    - [ ] Generated content per platform
  - [ ] Provide toaster notifications for success/error events.

- ## 8. Testing & CI**
  - [ ] Add Jest/React-Testing-Library tests for all new hooks & components.
  - [ ] Ensure Playwright E2E covers full happy-path (upload → transcribe → generate).
  - [ ] Update GitHub Actions workflow to run frontend unit & e2e tests.

- ## 9. Documentation Updates**
  - [ ] Update `docs/setup_and_ui.md` with new environment variables & setup steps.
  - [ ] Provide API contract examples for `/transcribe`, `/generate`, and `/validate`.
  - [ ] Add GIF walkthrough of the completed UI flow.

Each task above can be individually executed & verified. A programming agent should tackle them top-to-bottom, running associated unit or E2E tests before checking the box and committing progress. 

### How to check off tasks
Replace the empty space inside the brackets with an `x` like so: `[x]`.
> Example:  
> - [x] Install dependencies

Happy hacking! 🚀 