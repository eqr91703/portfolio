import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function proxy(request: Parameters<typeof intlMiddleware>[0]) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // 排除 _next 靜態資源、favicon、api 路由，以及所有 public/ 內的靜態檔
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html|pdf|md|pptx|txt|ico|xml|json|woff|woff2|ttf)$).*)',
  ],
};
