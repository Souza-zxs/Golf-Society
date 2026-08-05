"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ApiError, adminApi, api, type BlogCategory, type BlogPost } from "@/lib/api";
import { useAdminFetch } from "@/lib/use-admin-fetch";
import { StatusBadge } from "@/components/admin/status-badge";
import { PageHeader } from "@/components/admin/page-header";
import { LoadingState, EmptyState } from "@/components/admin/list-state";
import { formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { FormNotice } from "@/components/forms/field";

export default function AdminBlogPage() {
  const adminFetch = useAdminFetch();
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [categories, setCategories] = useState<BlogCategory[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [categoryNotice, setCategoryNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [creatingCategory, setCreatingCategory] = useState(false);

  async function load() {
    try {
      const [postsData, categoriesData] = await Promise.all([
        adminFetch((key) => adminApi.blog.listPostsAdmin(key)),
        api.blog.listCategories(),
      ]);
      setPosts(postsData.data);
      setCategories(categoriesData);
    } catch {
      setError("Não foi possível carregar o blog.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Remover este post definitivamente?")) return;
    setDeletingId(id);
    try {
      await adminFetch((key) => adminApi.blog.deletePost(key, id));
      setPosts((prev) => prev?.filter((post) => post.id !== id) ?? prev);
    } catch {
      setError("Não foi possível remover o post.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCreateCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatingCategory(true);
    setCategoryNotice(null);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const slug = String(form.get("slug") ?? "").trim();

    try {
      const created = await adminFetch((key) => adminApi.blog.createCategory(key, { name, slug }));
      setCategories((prev) => (prev ? [...prev, created] : [created]));
      setCategoryNotice({ type: "success", message: "Categoria criada." });
      event.currentTarget.reset();
    } catch (err) {
      setCategoryNotice({
        type: "error",
        message: err instanceof ApiError ? err.message : "Erro ao criar categoria.",
      });
    } finally {
      setCreatingCategory(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Blog"
        title="Posts"
        action={
          <Link href="/admin/blog/novo">
            <Button variant="solid">Novo post</Button>
          </Link>
        }
      />

      {error ? <p className="text-sm text-red-800">{error}</p> : null}

      {!posts ? (
        <LoadingState label="Carregando posts" />
      ) : posts.length === 0 ? (
        <EmptyState label="Nenhum post ainda." />
      ) : (
        <div className="overflow-x-auto border border-ink/10 bg-white shadow-[0_1px_3px_rgba(14,18,16,0.05)]">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="bg-ink/5 font-data text-[11px] uppercase tracking-[0.14em] text-stone">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Criado em</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-ink/10 transition-colors hover:bg-ink/1.5">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{post.title}</p>
                    <p className="text-xs text-stone">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-stone">{post.blog_categories?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-4 py-3 text-stone">{formatDateTime(post.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="font-data text-[11px] uppercase tracking-[0.14em] text-gold hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="font-data text-[11px] uppercase tracking-[0.14em] text-red-800 hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl text-ink">Categorias</h2>
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <span key={category.id} className="border border-ink/15 bg-white px-3 py-1 text-xs text-ink/80">
              {category.name}
            </span>
          ))}
        </div>
        <form onSubmit={handleCreateCategory} className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-2">
            <span className="font-data text-[11px] uppercase tracking-[0.18em] text-stone">Nome *</span>
            <input name="name" required className="border border-ink/20 bg-transparent px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-data text-[11px] uppercase tracking-[0.18em] text-stone">Slug *</span>
            <input name="slug" required className="border border-ink/20 bg-transparent px-3 py-2 text-sm" />
          </label>
          <Button type="submit" variant="outline-light" disabled={creatingCategory}>
            {creatingCategory ? "Criando…" : "Nova categoria"}
          </Button>
        </form>
        <FormNotice status={categoryNotice} />
      </section>
    </div>
  );
}
