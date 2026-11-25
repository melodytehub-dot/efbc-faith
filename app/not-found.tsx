import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap not-found">
      <span className="eyebrow">Page not found</span>
      <h1 style={{ marginTop: 14 }}>This page is not here</h1>
      <p className="lede" style={{ margin: "16px auto 28px" }}>
        The link may be out of date. Return home to continue.
      </p>
      <Link href="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}
