import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwtPayload(token: string): any | null {
    try {
      const payload = token.split('.')[1]; // Lấy phần payload
      const decoded = atob(payload); // Giải mã base64
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }

export function middleware(request: NextRequest){
    //Lấy token từ cookie
    const token = request.cookies.get("token")?.value

    //Nếu ko có token điều hướng về trang auth
    if(!token){
        return NextResponse.redirect(new URL('/login', request.url))
    }
    const { pathname }= request.nextUrl
    if(pathname.startsWith('/admin')){
        const payload = parseJwtPayload(token);

        if (!payload || payload.role !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher:['/profile', '/cart/:path*', '/order/:path*', '/checkout/:path*', '/search/:path*', '/admin/:path*']
};