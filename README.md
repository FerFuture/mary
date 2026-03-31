This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy en Vercel

1. **Base de datos:** esta app usa **PostgreSQL** (no SQLite). Creá una base gratis en [Neon](https://neon.tech) o [Supabase](https://supabase.com), copiá la connection string.
2. **Variables de entorno** en Vercel (Project → Settings → Environment Variables), mismas claves que en [`.env.example`](./.env.example): al menos `DATABASE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `OWNER_EMAIL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_URL`.
3. **Esquema y datos:** desde tu PC, con la misma `DATABASE_URL` de producción:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
4. En Vercel: **Framework Preset** = Next.js, **Root Directory** = `.` (raíz del repo), **Build Command** = `npm run build` (por defecto).
5. Si ves **404 NOT_FOUND** al abrir la URL: revisá el último **Deployment** en Vercel (¿está en verde?). Si falló el **build**, abrí **Build Logs**. Si el build pasó pero la página falla, revisá **Runtime Logs** y que `DATABASE_URL` esté definida en **Production**.

Más detalles: [Next.js en Vercel](https://nextjs.org/docs/app/building-your-application/deploying).
