import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";



const USER_ROUTES = new Set([ '/user/home']);
const PUBLIC_ROUTES = new Set([
  "/user/login", 
  "/user/signup", 
 
]);



const UNPROTECTED_ROUTES = new Set(["/_next/", "/favicon.ico", "/api/"]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log(req)

 
  if ([...UNPROTECTED_ROUTES].some(route => pathname.startsWith(route)) || pathname === "/") {
    console.log(`Allowing access to public route: ${pathname}`);
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.has(pathname)) {
    console.log(`Allowing access to public page: ${pathname}`);
    return NextResponse.next();
  }

  // Verify token to get role
  const tokenData = await verifyToken("refreshToken", req);
  const role = tokenData?.role;

  if (!role) {
    console.log(`Redirecting unauthenticated user from ${pathname} to /login`);
    return NextResponse.redirect(new URL("/user/login", req.url));
  }

 

  if (role === "user" && !USER_ROUTES.has(pathname)) {
    console.log(`Unauthorized access attempt by user to ${pathname}. Redirecting to /userHome`);
    return NextResponse.redirect(new URL("/user/home", req.url));
  }

  console.log(`Allowing access to ${pathname} for role: ${role}`);
  return NextResponse.next();
}



async function verifyToken(tokenName: string, req: NextRequest): Promise<{ role: string | null }> {
  
  const token = req.cookies.get(tokenName);  
  console.log(req.cookies);
  console.log(token?.value, '------------------------------------------');
  
  if (!token?.value) {
    console.error("Token not found in cookies");
    return { role: null };
  }

  const secret = process.env.JWT_SECRET;  // Retrieve the secret from environment variables
  console.log('secret', secret);
  if (!secret) {
    console.error("JWT_SECRET is not defined in environment variables");
    return { role: null };
  }

  try {
    // Verify the token using jose's jwtVerify function
    const { payload } = await jwtVerify(token.value, new TextEncoder().encode(secret));
    console.log('decoded payload', payload);

  
    const role = payload?.role as string | undefined;  // Type assertion to string

    if (!role) {
      console.error("Role not found in token payload");
      return { role: null };
    }

    console.log(`Verified role: ${role}`);
    return { role };  // Return the role
  } catch (err: any) {
    console.error(`Failed to verify token: ${err.message}`);
    return { role: null };  // Return null if token verification fails
  }
}
