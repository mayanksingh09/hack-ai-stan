This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

### Video Content Processing
- **Video Upload**: Upload video files (MP4, WebM, AVI, MOV, etc.) with automatic cloud storage
- **Video Transcription**: Automatic transcription of uploaded videos using AI
- **Automatic Thumbnail Generation**: Extract the first frame from uploaded videos to create thumbnails automatically
- **Platform-Specific Content**: Generate social media content optimized for different platforms
- **Script Editing**: Edit and refine auto-generated transcripts

### Video Thumbnail Generation
The application includes an intelligent thumbnail generation feature that can extract the first frame from any uploaded video:

1. Upload your video file using the video uploader
2. Navigate to the thumbnail section
3. Click the "Generate from Video" button to automatically extract and use the first frame as your thumbnail
4. The generated thumbnail is automatically optimized for web use (JPEG format, 90% quality)

This feature uses HTML5 Canvas API to process video frames client-side, ensuring privacy and fast processing.

### Supported File Formats
- **Videos**: MP4, WebM, OGG, AVI, MOV (up to 100MB)
- **Images**: JPEG, PNG, WebP, GIF (up to 5MB)

## Getting Started

### Prerequisites

Before running the application, you need to set up your environment variables:

1. Create a `.env.local` file in the root directory
2. Add the following Supabase configuration variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_S3_ENDPOINT=your_supabase_s3_endpoint_here
SUPABASE_STORAGE_BUCKET=your_supabase_storage_bucket_here
```

### Running the Development Server

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
