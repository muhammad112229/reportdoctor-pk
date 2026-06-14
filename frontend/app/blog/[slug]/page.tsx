import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/site";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) {
    return {};
  }
  return {
    title: post.title,
    description: post.description,
    robots: {
      index: false,
      follow: true
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) {
    notFound();
  }

  return (
    <>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">ReportDoctor.pk Learn</p>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
        </div>
      </section>
      <article className="section article-body">
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <div className="hero-actions">
          <Link className="button primary" href="/free-scan">
            Analyze a File
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link className="button secondary" href="/templates">
            Download Templates
          </Link>
        </div>
      </article>
    </>
  );
}
