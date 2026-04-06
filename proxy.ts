import { auth } from "@/auth";

export default auth(async (req) => {
  const session = req.auth;
  const pathname = req.nextUrl.pathname;

  if (!session?.user?.email) {
    return Response.redirect(new URL("/", req.nextUrl));
  }

  if (pathname.startsWith("/dashboard/showtimes")) {
    return;
  }

  if (pathname.startsWith("/dashboard")) {
    if (session?.user?.role !== "ADMIN") {
      return Response.redirect(new URL("/", req.nextUrl));
    }
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};