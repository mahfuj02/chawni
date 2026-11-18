import { notFound } from "next/navigation";

// Any unknown URL under a valid locale lands here and renders the branded 404.
export default function CatchAll() {
  notFound();
}
