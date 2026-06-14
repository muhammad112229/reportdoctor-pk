import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/site";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Learn how to analyze Excel data, create sales reports, find missing values, remove duplicates, and build monthly business reports."
};

export default function LearnPage() {
  return (
    <>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Learn</p>
          <h1>Practical Excel and CSV reporting guides</h1>
          <p>Original beginner-friendly articles for business owners, sellers, researchers, and spreadsheet users.</p>
        </div>
      </section>
      <section className="section">
        <div className="card-grid">
          {blogPosts.map((post) => (
            <article className="blog-card" key={post.slug}>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <div className="card-footer">
                <Link className="button secondary" href={`/learn/${post.slug}`}>
                  Read Article
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

